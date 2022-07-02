module.exports = {
    plugins: [
        require('cssnano')({
            preset: [ 'advanced', { reduceIdents: false } ] // messes with grid areas
        }),
    ],
};
