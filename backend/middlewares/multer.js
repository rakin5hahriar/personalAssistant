import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage: storage });

export default upload;
// export const uploadMiddleware = (req, res, next) => {
//     upload.single("file")(req, res, (err) => {
//         if (err) {
//             return res.status(400).json({ success: false, message: "File upload failed", error: err.message });
//         }
//         next();
//     });
// }; 