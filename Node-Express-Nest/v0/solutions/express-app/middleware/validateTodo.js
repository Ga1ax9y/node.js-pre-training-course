export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

export const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    return next(new ValidationError('ID must be a valid number'));
  }
  req.parsedId = Number(id);
  next();
};

export const validateCreateTodo = (req, res, next) => {
  const { title, description } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return next(new ValidationError('Field "title" is required and must be a non-empty string'));
  }
  if (title.length > 100) {
    return next(new ValidationError('Field "title" must be 100 characters or less'));
  }
  if (description !== undefined && typeof description !== 'string') {
    return next(new ValidationError('Field "description" must be a string'));
  }

  req.cleanedData = {
    title: title.trim(),
    description: description?.trim() || '',
  };
  next();
};

export const validateSearch = (req, res, next) => {
  const { keyword } = req.query;
  if (!keyword || typeof keyword !== 'string' || keyword.trim() === '') {
    return next(new ValidationError('Query parameter "keyword" is required'));
  }
  req.cleanedKeyword = keyword.trim();
  next();
};
