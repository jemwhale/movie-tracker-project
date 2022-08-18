const {db} = require('./db')
const {Show, User, WatchedList} = require('./models/index')
const { Op, DataTypes } = require('sequelize');

User.belongsToMany(Show, {through: 'watched-list'});
Show.belongsToMany(User, {through: 'watched-list'});

  describe('Models', () => {

    beforeAll(async () => {
        await db.sync({ force: true });
    });


    test('can create a new Show ', async () => {
        let show1 = await Show.create({
            title: 'Atlanta',
            genre: ['Comedy', 'Drama', 'Surrealism'],
        })
        expect(show1.genre[0]).toEqual('Comedy')
    });

    test('can create a new User', async () => {
        let user1 = await User.create({
            name: 'Jack',
            email: 'jack@jack.jack',
        })
        expect(user1.name).toEqual('Jack')
    });

    test('can add multiple shows to a user', async () => {
        let user1 = await User.create({
            name: 'Name',
            email: 'name@yahoo.co.uk',
        })
        let show1 = await Show.create({
            title: 'Show',
            genre: ['Comedy'],
        })
        let show2 = await Show.create({
            title: 'Show Time Baby',
            genre: ['Drama'],
        })
        await user1.addShow(show1)
        await user1.addShow(show2)
        let howMany = await user1.getShows()
        expect(howMany.length).toEqual(2)

    });

    test('can add a show to a user with rating only between 0-10', async () => {
        let user1 = await User.create({
            name: 'A Person',
            email: 'personlegend@hotmail.co.uk',
        })
        let show1 = await Show.create({
            title: 'Banger',
            genre: ['Documentary'],
        })
        let show2 = await Show.create({
            title: 'Something',
            genre: ['Documentary'],
        })
        let show3 = await Show.create({
            title: 'Another Show',
            genre: ['Documentary'],
        })

        try{
            await user1.addShow(show1, {through: {rating: 100}})
        }catch(err){
            expect(err.errors[0].errors.errors[0].message).toEqual('Rating needs to be out of 10!')
        }
        try{
            await user1.addShow(show2, {through: {rating: -5}})
        }catch(err){
            expect(err.errors[0].errors.errors[0].message).toEqual('Rating needs to be out of 10!')
        }
        await user1.addShow(show3, {through: {rating: 7}})
        let howMany1 = await user1.getShows()
        expect(howMany1.length).toEqual(1)
    });

    test('can find all shows from a user', async () => {
        let user1 = await User.create({
            name: 'Paul',
            email: 'email@bhighv.com',
        })
        let show1 = await Show.create({
            title: 'The Thing',
            genre: ['Horror'],
        })
        let show2 = await Show.create({
            title: 'Terminator 2',
            genre: ['Action'],
        })
        let show3 = await Show.create({
            title: 'RoboCop',
            genre: ['Action'],
        })
        let show4 = await Show.create({
            title: 'Up',
            genre: ['Family'],
        })
        await user1.addShow(show1, {through: {rating: 4}})
        await user1.addShow(show2, {through: {rating: 5}})
        await user1.addShow(show3, {through: {rating: 6}})
        await user1.addShow(show4)
 
        let result = await WatchedList.findAll({
            where: {
                userid: user1.id
            }
        })

        expect(result.length).toEqual(4)
    });
        

    test('can find all rated shows from a user', async () => {
        let user1 = await User.create({
            name: 'Dave',
            email: 'david@hotmail.co.uk',
        })
        let show1 = await Show.create({
            title: 'Lost',
            genre: ['Documentary'],
        })
        let show2 = await Show.create({
            title: 'The News',
            genre: ['Comedy'],
        })
        let show3 = await Show.create({
            title: 'Monday Night Football',
            genre: ['Sport'],
        })
        let show4 = await Show.create({
            title: 'Darts',
            genre: ['Sport'],
        })
        await user1.addShow(show1, {through: {rating: 8}})
        await user1.addShow(show2, {through: {rating: 7}})
        await user1.addShow(show3, {through: {rating: 9}})
        await user1.addShow(show4)
 
        let result = await WatchedList.findAll({
            where: {
                userid: user1.id,
                rating: {
                    [Op.gt]: -1
                }
            }
        })

        expect(result.length).toEqual(3)
    });

    test('can find all shows of one genre', async () => {
        let allShows = await Show.findAll() 
        let result = allShows.filter((x) => {
            if(x.genre.includes('Comedy')){
                return true
            }
            
        })
        console.log(result)
        expect(result.length).toEqual(3)
    });
        
})