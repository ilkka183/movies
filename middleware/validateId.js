module.exports = (req, res, next) => {
  const id = parseInt(req.params.id);

  if (isNaN(id))
    return res.status(404).send('Invalid ID.');

  next();
}
