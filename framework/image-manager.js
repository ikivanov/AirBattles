define([""], function() {
	const NO_IMAGE_LIST_PROVIDED_MSG = "Provide an image list to load before calling ImageManager.loadImages!";

	class ImageManager {
		constructor() {
			let that = this;

			that.cachedImages = {};
		}

		loadImage(url) {
			let that = this,
				promise = new Promise(function(resolve, reject) {
					let image = that.cachedImages[url];

					if (image) {
						resolve(image);
					} else {
						image = new Image();
						image.onload = function() {
							that.cachedImages[url] = image;
							resolve(image);
						}
						image.onerror = function(err) {
							reject({ reason: "${url} does not exist" });
						}
						image.src = url;
					}
				});

			return promise;
		}

		loadImages(imagesToLoad) {
			let that = this,
				promises = [];

			if (!imagesToLoad || imagesToLoad.length === 0) {
				return Promise.reject({ reason: NO_IMAGE_LIST_PROVIDED_MSG });
			}

			for (let i = 0; i < imagesToLoad.length; i++) {
				promises.push(that.loadImage(imagesToLoad[i]));
			}

			return Promise.all(promises);
		}

		getImage(url) {
			let that = this;

			return that.cachedImages[url];
		}
	}

	return new ImageManager();
});