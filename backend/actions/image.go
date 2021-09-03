package actions

import (
	"context"
	"image"
	"image/png"
	"os"

	"cloud.google.com/go/storage"
	"github.com/disintegration/imaging"
)

var ImageBucketName = ""

const IMAGE_SIZE_LIMIT = 800

func init() {
	ImageBucketName = os.Getenv("STORAGE_BUCKET_NAME")
}

func SaveImage(ctx context.Context, path string, img image.Image) error {
	client, err := storage.NewClient(ctx)
	if err != nil {
		return err
	}
	defer client.Close()

	bucket := client.Bucket(ImageBucketName)
	obj := bucket.Object(path)
	w := obj.NewWriter(ctx)
	if err := png.Encode(w, imaging.Fit(img, IMAGE_SIZE_LIMIT, IMAGE_SIZE_LIMIT, imaging.Lanczos)); err != nil {
		return err
	}
	return w.Close()
}

func DeleteImage(ctx context.Context, path string) error {
	client, err := storage.NewClient(ctx)
	if err != nil {
		return err
	}
	defer client.Close()

	bucket := client.Bucket(ImageBucketName)
	obj := bucket.Object(path)
	return obj.Delete(ctx)
}
