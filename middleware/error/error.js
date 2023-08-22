import ApiError from "../../exceptions/api-error.js";

const error = (err, req, res, next) => {
    console.log('4', err);
    if(err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors})
    }
    return res.status(500).json('Произошла непредвиденная ошибка');
};

export default error