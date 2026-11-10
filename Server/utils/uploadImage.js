import cloudinary from '../config/cloudinary.js'

const uploadImage = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'stationery-products',
                resource_type: 'image',
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error.message)
                    return reject(error)
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                })
            }
        )

        stream.end(buffer)
    })
}

export default uploadImage
