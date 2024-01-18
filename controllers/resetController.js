const collections = mongoose.connection.collections;

const deleteData = async () => {
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
};

deleteData().then(() => {
    console.log('All data deleted!');
    mongoose.connection.close();
});

