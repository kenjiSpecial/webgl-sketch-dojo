
export function fitImage (width, height, imageW, imageH) {
    var sizes = {};
    sizes.w = width;
    var ratio = sizes.w/imageW;
    sizes.h = Math.round(imageH * ratio);
    sizes.margin = 0;

    if (sizes.h < height) {
        sizes.h = height;
        ratio = sizes.h/imageH;
        sizes.w = Math.round(imageW * ratio);
        sizes.margin = -(sizes.w - width)/2;
        }

    return sizes;
};