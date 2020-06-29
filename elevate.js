const mongoose = require('mongoose');

const commandLineArgs = process.argv.slice(2);

if (commandLineArgs.length > 1) {
    const port = process.env.MONGO_PORT || 27017;
    const host = process.env.MONGO_HOST || 'localhost';
    const database = process.env.MONGO_DATABASE || 'sensrnet';

    const url = `mongodb://${host}:${port}/${database}`;
    const connectOptions = {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    }
    mongoose.connect(url, connectOptions).then();

    const UserSchema = new mongoose.Schema({
        _id: { type: String, required: true },
        role: { type: String, required: false },
        ownerId: { type: String, required: true },
        password: { type: String, required: true },
    });

    const UserModel = mongoose.model('User', UserSchema);

    const userId = commandLineArgs[0];
    const role = commandLineArgs[1];
    console.log(`Elevating ${userId} to ${role}.`);

    const filterKwargs = {
        _id: userId
    };
    const updateKwargs = {
        role: role
    }
    UserModel.updateOne(filterKwargs, updateKwargs).then(() => {
        console.log(`Successfully elevated ${userId} to ${role}.`);
        process.exit();
    }, () => {
        console.log(`Failed to elevate ${userId} to ${role}.`);
        process.exit();
    });
} else {
    console.log('Supply command line arguments (1) email (2) role.');
    process.exit();
}
