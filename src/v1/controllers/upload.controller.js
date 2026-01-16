// this is an exemple controller for handling file uploads
export const uploadFile = (req, res) => {
  
  if (!req.file) {
      req.log?.warn("No file uploaded");
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Log upload
  req.log?.info({ filename: req.file.filename, size: req.file.size }, 'file uploaded');

  const uploadDir = process.env.UPLOAD_DIR || 'uploads';
  const fileUrl = `${req.protocol}://${req.get('host')}/${uploadDir}/${req.file.filename}`;
  res.status(201).json({ filename: req.file.filename, url: fileUrl });
};
