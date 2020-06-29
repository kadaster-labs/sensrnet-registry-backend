const mongoose = require('mongoose');

const commandLineArgs = process.argv.slice(2);

const exit = () => {
    process.exit();
}

if (commandLineArgs.length > 1) {
    const port = process.env.MONGO_PORT || 27017;
    const host = process.env.MONGO_HOST || 'localhost';
    const database = process.env.MONGO_DATABASE || 'sensrnet';

    const url = 'mongodb://' + host + ':' + port.toString() + '/' + database;
    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,
        useFindAndModify: false});

    const UserSchema = new mongoose.Schema({
        _id: { type: String, required: true },
        staff: { type: Boolean, required: false },
        admin: { type: Boolean, required: false },
        ownerId: { type: String, required: true },
        password: { type: String, required: true },
    });

    const UserModel = mongoose.model('User', UserSchema);

    const makeStaff = commandLineArgs[1] === 'staff';
    if (makeStaff) {
        console.log('Elevating to staff.');
        const filterKwargs = {
            _id: commandLineArgs[0]
        };
        const updateKwargs = {
            staff: true
        }
        UserModel.updateOne(filterKwargs, updateKwargs).then(() => {
            console.log('Successfully elevated to staff.');
            exit();
        }, () => {
            console.log('Failed to elevate to staff.');
            exit();
        });
    } else {
        const makeAdmin = commandLineArgs[1] === 'admin';
        if (makeAdmin) {
            console.log('Elevating to admin.');
            const filterKwargs = {
                _id: commandLineArgs[0]
            };
            const updateKwargs = {
                admin: true
            }
            UserModel.updateOne(filterKwargs, updateKwargs).then(() => {
                console.log('Successfully elevated to admin.');
                exit();
            }, () => {
                console.log('Failed to elevate to admin.');
                exit();
            });
        }
    }
} else {
    console.log('Supply command line arguments (1) email (2) staff / admin.');
    exit();
}
