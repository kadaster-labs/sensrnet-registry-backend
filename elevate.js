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
        ownerId: { type: String, required: true },
        password: { type: String, required: true },
        isStaff: { type: Boolean, required: false },
        isAdmin: { type: Boolean, required: false },
    });

    const UserModel = mongoose.model('User', UserSchema);

    const userId = commandLineArgs[0];
    const makeStaff = commandLineArgs[1] === 'staff';
    if (makeStaff) {
        console.log(`Elevating ${userId} to staff.`);

        const filterKwargs = {
            _id: userId
        };
        const updateKwargs = {
            isStaff: true
        }
        UserModel.updateOne(filterKwargs, updateKwargs).then(() => {
            console.log(`Successfully elevated ${userId} to staff.`);
            process.exit();
        }, () => {
            console.log(`Failed to elevate ${userId} to staff.`);
            process.exit();
        });
    } else {
        const makeAdmin = commandLineArgs[1] === 'admin';
        if (makeAdmin) {
            console.log(`Elevating ${userId} to admin.`);

            const filterKwargs = {
                _id: commandLineArgs[0]
            };
            const updateKwargs = {
                isAdmin: true
            }
            UserModel.updateOne(filterKwargs, updateKwargs).then(() => {
                console.log(`Successfully elevated ${userId} to admin.`);
                process.exit();
            }, () => {
                console.log(`Failed to elevate ${userId} to admin.`);
                process.exit();
            });
        }
    }
} else {
    console.log('Supply command line arguments (1) email (2) staff / admin.');
    process.exit();
}
