const productRouter = require('./Products');
const homeRouter = require('./Home');
const categoryRouter = require('./Category');
const cartRouter = require('./Cart');
function router(app) {
    app.use('/', homeRouter);
    app.use('/products', productRouter);
    app.use('/san-pham', productRouter);
    app.use('/danh-muc-san-pham', categoryRouter);
    app.use('/gio-hang', cartRouter);
}

module.exports = router;
