define([""], function() {
	const NO_IMAGE_LIST_PROVIDED_MSG = "Provide an image list to load before calling ImageManager.loadImages!";

	class ImageManager {
		constructor() {
			this.cachedImages = {};
		}

		loadImage(url) {
			let promise = new Promise((resolve, reject) => {
					let image = this.cachedImages[url];

					if (image) {
						resolve(image);
					} else {
						image = new Image();
						image.onload = _ => {
							this.cachedImages[url] = image;
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
			let promises = [];

			if (!imagesToLoad || imagesToLoad.length === 0) {
				return Promise.reject({ reason: NO_IMAGE_LIST_PROVIDED_MSG });
			}

			for (let i = 0; i < imagesToLoad.length; i++) {
				promises.push(this.loadImage(imagesToLoad[i]));
			}

			return Promise.all(promises);
		}

		getImage(url) {
			return this.cachedImages[url];
		}
	}

	return new ImageManager();
});