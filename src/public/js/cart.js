let shoppingCart;

if (localStorage.getItem('shopping-cart')) {
    shoppingCart = JSON.parse(localStorage.getItem('shopping-cart'));
} else {
    shoppingCart = JSON.parse(localStorage.setItem('shopping-cart', '[]'));
}

$(document).ready(function ($) {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        },
    });
    $('#addCart').click(() => {
        let pid = $('#pid').text();
        let quantity = $('#quantity').val();
        // alert('clicked');
        $.ajax({
            url: '/addCart',
            method: 'POST',
            data: { pid, quantity },
            success: (data) => {
                alert(data.msg);
            },
        });
    });

    $('.add-to-cart').click(function () {
        var selected = $('#variantProductSelect').find(':selected');
        var img = $('#variantProductSelect').data('img');
        var material = $('#variantProductSelect').data('material');
        var title = $('#variantProductSelect').data('title');
        var slug = $('#variantProductSelect').data('slug');
        var id = selected.data('sku');
        var quantity = $('.qty').val();
        var price = selected.data('price');
        var discount = selected.data('discount');
        var rate = selected.data('rate');
        var color = $('#variantProductColor .ui-selected').data('color');
        var size = selected.data('size');
        const cartItem = {
            product: {
                id,
                color,
                size,
                img,
                material,
                title,
                slug,
            },
            price,
            discount,
            rate,
        };

        let checkID = shoppingCart.some((item) => {
            item = JSON.parse(item);
            return item.product.id === id;
        });

        if (checkID) {
            changeNumberOfUnit(id, quantity);
        } else {
            shoppingCart.push(
                JSON.stringify({
                    ...cartItem,
                    quantity: parseInt(quantity),
                }),
            );
        }
        renderCounter();
        Toast.fire({
            icon: 'success',
            title: 'Th??m v??o gi??? h??ng th??nh c??ng',
        });
        localStorage.setItem('shopping-cart', JSON.stringify(shoppingCart));

        window.location.reload();
    });

    $('.minus').click(function () {
        const id = $(this).data('product_id');
        let qtySold = $(`.quantity_${id}`).val();
        var value = parseInt(qtySold, 10);
        value = isNaN(value) ? 0 : value;
        if (value >= 1) {
            value--;
            $('.quantity_' + id).val(value);
        }
        let checkID = shoppingCart.some((item) => {
            item = JSON.parse(item);
            return item.product.slug === id;
        });

        if (checkID) {
            changeNumberOfUnit(id, qtySold, 'minus');
            if (value <= 0) {
                shoppingCart = shoppingCart.filter((item) => {
                    item = JSON.parse(item);
                    return item.product.slug != id;
                });
            }
            updateShoppingCart();
            renderTotalPrice();
        }
    });

    $('.plus').click(function () {
        const id = $(this).data('product_id');
        let qtySold = $('.quantity_' + id).val();
        var value = parseInt(qtySold, 10);
        value = isNaN(value) ? 0 : value;
        if (value < 10) {
            value++;
            $('.quantity_' + id).val(value);
        }
        let checkID = shoppingCart.some((item) => {
            item = JSON.parse(item);
            return item.product.slug === id;
        });
        if (checkID) {
            changeNumberOfUnit(id, qtySold, 'plus');
            renderTotalPrice();
        }
    });

    function renderCounter() {
        var no = JSON.parse(localStorage.getItem('shopping-cart')).length;
        return (document.getElementById('cart-contents-count').innerText = no);
    }
    renderCounter();

    $('.remove-item-cart').click(function () {
        var id = $(this).data('sku');
        shoppingCart = shoppingCart.filter((item) => {
            item = JSON.parse(item);
            return item.product.id != id;
        });
        updateShoppingCart();
    });
    function updateShoppingCart() {
        localStorage.setItem('shopping-cart', JSON.stringify(shoppingCart));
        renderProductToCart();
        renderTotalPrice();
    }

    $('.send_order').click(function () {
        var name = $('#name').val();
        var email = $('#email').val();
        var phone = $('#phone').val();
        var address = $('#address').val();
        var company_name = $('#company_name').val();
        var tax_no = $('#tax_no').val();
        var company_adress = $('#company_adress').val();
        var total = $('#order-total').text() || 0;
        var note = $('#note').val();
        var method = $('input[name="payment_method"]').val();
        let lsCartItem = shoppingCart.map((item) => {
            item = JSON.parse(item);
            return item;
        });
        let swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger mx-4',
            },
            buttonsStyling: false,
        });
        if (phone == '' || address == '' || name == '') {
            swalWithBootstrapButtons.fire(
                'Vui l??ng ??i???n ?????y ????? th??ng tin tr?????c khi ?????t h??ng',
                'Thanh to??n kh??ng th??nh c??ng',
                'error',
            );
        } else {
            swalWithBootstrapButtons
                .fire({
                    title: 'X??c nh???n thanh to??n ????n h??ng',
                    text: 'M???t khi ?????t ????n h??ng b???n ch??? c?? th??? h???y b??? trong v??ng 24h',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'X??c nh???n ?????t h??ng',
                    cancelButtonText: 'H???y ?????t h??ng',
                    reverseButtons: true,
                })
                .then((result) => {
                    if (result.isConfirmed) {
                        const cart = {
                            name,
                            email,
                            phone,
                            address,
                            company_name,
                            tax_no,
                            company_adress,
                            note,
                            lsCartItem,
                            total,
                            method,
                        };
                        $.ajax({
                            url: '/gio-hang/add-order',
                            method: 'POST',
                            data: {
                                name,
                                email,
                                phone,
                                address,
                                company_name,
                                tax_no,
                                company_adress,
                                note,
                                total,
                                lsCartItem,
                            },
                            success: function (rs) {
                                console.log(rs);
                                if (rs.success) {
                                    swalWithBootstrapButtons.fire(
                                        'C??m ??n b???n ???? ?????t h??ng',
                                        'b???n ???? thanh to??n th??nh c??ng',
                                        'success',
                                    );

                                    localStorage.removeItem('shopping-cart');

                                    window.setTimeout(function () {
                                        location.reload();
                                    }, 3000);
                                } else {
                                    swalWithBootstrapButtons.fire(
                                        'Vui l??ng ??i???n ?????y ????? th??ng tin tr?????c khi ?????t h??ng',
                                        'Thanh to??n kh??ng th??nh c??ng',
                                        'error',
                                    );

                                    window.setTimeout(function () {
                                        location.reload();
                                    }, 3000);
                                }
                            },
                        });
                    } else if (
                        /* Read more about handling dismissals below */
                        result.dismiss === Swal.DismissReason.cancel
                    ) {
                        swalWithBootstrapButtons.fire('Cancelled', 'Your imaginary file is safe :)', 'error');
                    }
                });
        }
    });
});

function changeNumberOfUnit(id, quantity, action) {
    if (action) {
        shoppingCart = shoppingCart.map((item) => {
            item = JSON.parse(item);
            let qty = parseInt(item.quantity);
            if (item.product.slug === id) {
                if (action == 'minus') {
                    qty--;
                } else if (action == 'plus') {
                    qty++;
                }
            }
            return JSON.stringify({
                ...item,
                quantity: qty,
            });
        });
        localStorage.setItem('shopping-cart', JSON.stringify(shoppingCart));
    } else {
        shoppingCart = shoppingCart.map((item) => {
            item = JSON.parse(item);
            let qty = parseInt(item.quantity);
            if (item.product.id === id) {
                qty += parseInt(quantity);
            }
            return JSON.stringify({
                ...item,
                quantity: qty,
            });
        });
        localStorage.setItem('shopping-cart', JSON.stringify(shoppingCart));
    }
}

function formatCurrency(price) {
    if (price) return price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.') + ' ???';
    return 'Li??n h???';
}
let bodyCart = document.getElementById('body-cart');
function renderProductToCart() {
    shoppingCart = JSON.parse(localStorage.getItem('shopping-cart'));
    let body = '';
    if (shoppingCart) {
        shoppingCart.forEach((item) => {
            item = JSON.parse(item);
            body += ` <tr class='cart-form__cart-item cart_item'>
                                <td class='product-remove text-center' >
                                    <a
                                        href=''
                                        style='color: var(--yellow)'
                                        class='remove-item-cart'
                                        data-sku='${item.product.id}'
                                        aria-label='X??a s???n ph???m n??y'
                                    >x</a>
                                </td>

                                <td class='product-thumbnail'>
                                    <a
                                        href='/san-pham/${item.product.slug}'
                                    ><img
                                            width='200'
                                            height='200'
                                            src='${item.product.img}'
                                            class='attachment_thumbnail size_thumbnail'
                                            alt='${item.product.title}'
                                        /></a>
                                </td>

                                <td class='product-name' data-title='S???n ph???m'>
                                    <a
                                        href='/san-pham/${item.product.slug}'
                                    >${item.product.title}</a><dl class='variation'>
                                        <dt class='fs-6 d-inline-block text-light variation-ChtLiu'>Ch???t Li???u:</dt>
                                        <dd class='fs-6 d-inline-block variation-ChtLiu'><p>${item.product.material}</p>
                                        </dd>
                                        <br />
                                        <dt class='fs-6 d-inline-block text-light variation-KchThc'>K??ch Th?????c:</dt>
                                        <dd class='fs-6 d-inline-block variation-KchThc'><p>${item.product.size}</p>
                                        </dd>
                                        <br />
                                        <dt class='fs-6 d-inline-block text-light variation-MuSc'>M??u S???c:</dt>
                                        <dd class='fs-6 d-inline-block variation-MuSc'><p>${item.product.color}</p>
                                        </dd>
                                        <br />
                                    </dl>
                                </td>

                                <td class='product-quantity' data-title='S??? l?????ng'>
                                    <div class='qib-container'>
                                        <button
                                            type='button'
                                            data-product_id='${item.product.slug}'
                                            class='minus qib-button'
                                        >-</button>
                                        <div class='quantity buttons_added buttons-added'>
                                            <label class='screen-reader-text' for='quantity'>B??? B??n Trang ??i???m Hi???n ?????i
                                                H&amp;H SCU-G1692 s??? l?????ng</label>
                                            <input
                                                type='number'
                                                id='quantity'
                                                class='input-text qty quantity_${item.product.slug} text'
                                                step='1'
                                                min='0'
                                                max=''
                                                name='cart[9897af2e1014f2e1c831b8d6e18f6e57][qty]'
                                                value='${item.quantity}'
                                                title='SL'
                                                size='4'
                                                placeholder=''
                                                inputmode='numeric'
                                            />
                                        </div>
                                        <button
                                            type='button'
                                            data-product_id='${item.product.slug}'
                                            class='plus qib-button'
                                        >+</button>
                                    </div>
                                </td>

                                <td class='product-price' data-title='Gi??'>
                                    `;
            if (item.rate > 0) {
                body += `
                                    <span class='giathuong'>Gi?? ni??m y???t: </span>
                                    <del>
                                        <span class='Price-amount amount text-light'>
                                            ${formatCurrency(item.price)}
                                        </span></del>
                                    <br />
                                    <span class='giathuong'>Gi???m: </span>
                                    <span class='Price-amount amount fs-5'>
                                        ${item.rate}%
                                    </span>
                                    <br />
                                    <br />
                                    <span class='giathuong'>Gi?? khuy???n m??i: </span>
                                    <span class='Price-amount amount fs-5'>
                                        ${formatCurrency(item.discount)}
                                    </span>`;
            } else {
                body += `<span class='Price-amount amount'>
                                        <span class='Price-amount amount fs-5'>
                                            ${formatCurrency(item.price)}
                                        </span>
                                    </span>`;
            }
            body += `        
                                </td>
                            </tr>`;
        });
        bodyCart.innerHTML = body;
    }
}
renderProductToCart();

function renderTotalPrice() {
    let total = 0;

    let tmp = shoppingCart.map((item) => {
        item = JSON.parse(item);
        if (item.discount > 0) {
            return parseInt(item.discount) * parseInt(item.quantity);
        } else {
            return parseInt(item.price) * parseInt(item.quantity);
        }
    });
    total = tmp.reduce((acc, item) => {
        return acc + item;
    }, 0);

    let totalPrice = document.getElementById('order-total');
    return (totalPrice.innerText = formatCurrency(total));
}
renderTotalPrice();
