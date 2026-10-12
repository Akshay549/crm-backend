// "id" instead of "_id" and hides "__v"
export const toJsonOptions = {
    versionKey: false,
    transform: (_doc: unknown, ret: Record<string, any>) => {
        ret.id = ret._id;
        delete ret._id;
        return ret;
    },
};
