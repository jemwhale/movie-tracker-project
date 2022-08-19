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
            title: 'atlanta',
            genre: ['comedy', 'drama'],
        })
        expect(show1.genre[0]).toEqual('comedy')
    });

    test('can create a new User', async () => {
        let user1 = await User.create({
            name: 'jack',
            email: 'jack@jack.jack',
        })
        expect(user1.name).toEqual('jack')
    });

    test('can add multiple shows to a user', async () => {
        let user1 = await User.create({
            name: 'name',
            email: 'name@yahoo.co.uk',
        })
        let show1 = await Show.create({
            title: 'show',
            genre: ['comedy'],
        })
        let show2 = await Show.create({
            title: 'show time baby',
            genre: ['drama'],
        })
        await user1.addShow(show1)
        await user1.addShow(show2)
        let howMany = await user1.getShows()
        expect(howMany.length).toEqual(2)

    });

    test('can add a show to a user with rating only between 0-10', async () => {
        let user1 = await User.create({
            name: 'a person',
            email: 'personlegend@hotmail.co.uk',
        })
        let show1 = await Show.create({
            title: 'banger',
            genre: ['documentary', 'action'],
        })
        let show2 = await Show.create({
            title: 'something',
            genre: ['documentary', 'sport'],
        })
        let show3 = await Show.create({
            title: 'another show',
            genre: ['documentary'],
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
            name: 'paul',
            email: 'email@bhighv.com',
        })
        let show1 = await Show.create({
            title: 'the thing',
            genre: ['horror'],
        })
        let show2 = await Show.create({
            title: 'terminator 2',
            genre: ['action', 'sci-fi'],
        })
        let show3 = await Show.create({
            title: 'robocop',
            genre: ['action', 'sci-fi'],
        })
        let show4 = await Show.create({
            title: 'up',
            genre: ['family', 'comedy'],
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
            name: 'dave',
            email: 'david@hotmail.co.uk',
        })
        let show1 = await Show.create({
            title: 'lost',
            genre: ['drama', 'mystery'],
        })
        let show2 = await Show.create({
            title: 'the news',
            genre: ['comedy'],
        })
        let show3 = await Show.create({
            title: 'monday night football',
            genre: ['sport'],
        })
        let show4 = await Show.create({
            title: 'darts',
            genre: ['sport'],
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
            if(x.genre.includes('comedy')){
                return true
            }
            
        })
        expect(result.length).toEqual(4)
    });

    test('can update a show rating for a user', async () => {
        
        const found = await WatchedList.findOne({
            where: {
                userId: 2,
                showId: 3
            }
        })

        found.update({
            rating: 5
        })

        expect(found.rating).toEqual(5)
    });

    test('can add genres to a show without duplicating', async () => {
        const newGenres = ['surrealism', 'drama', 'comedy']
        const foundShow = await Show.findOne({
            where: {
                title: 'atlanta'
            }
        })
        let noDuplicates = foundShow.genre.split(',')
        for (each in newGenres){
            if (!noDuplicates.includes(newGenres[each])){
                noDuplicates.push(newGenres[each])
            }
        }
        foundShow.update({
            genre: noDuplicates
        })
        expect(foundShow.genre).toEqual(['comedy', 'drama', 'surrealism'])
    });
        
})