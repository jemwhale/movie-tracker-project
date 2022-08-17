const {db} = require('./db')
const {Show, User} = require('./models/index')

  describe('Models', () => {

    beforeAll(async () => {
        await db.sync({ force: true });
    });


    test('can create a new Show ', async () => {
        let show1 = await Show.create({
            title: 'Atlanta',
            genre: 'Comedy',
            rating: 10,
            status: false
        })
        expect(show1.genre).toEqual('Comedy')
    });

    test('can create a Show with a rating between 0-10 only', async () => {
            try{
                await Show.create({
                    title: 'Rick and Morty',
                    genre: 'Comedy',
                    rating: 100,
                    status: false
                })
        }catch(err){
            expect(err.message).toEqual('Validation error: Rating needs to be out of 10!')
        }
        try{
            await Show.create({
                title: 'Eatenders',
                genre: 'Trash',
                rating: -500,
                status: false
        })
        }catch(err){
            expect(err.message).toEqual('Validation error: Rating needs to be out of 10!')
        }
    });

    // test('can create a new User', async () => {
    //     expect().toEqual()
    // });
        
})