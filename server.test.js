const request = require('supertest');
const cookieParser = require('cookie-parser');
const app = require("./server");
const {agent} = require("supertest");
const agent1 = request.agent(app);
const agent2 = request.agent(app);
describe('User API test',() =>{
    test('tests POST request /user/register', async() => {
        agent1
            .post('/user/register')
            .send({
                username:'master',
                email:'master@example.com',
                image:'testImage',
                description:'top',
                password:'bacon',
            })
            .expect(201,'set-cookie')
    });
    test('tests POST request /user/register with existing username', async() => {
        agent2
            .post('/user/register')
            .send({
                username:'master',
                email:'nonexistingEmail@example.com',
                image:'testImage',
                description:'top',
                password:'bacon',
            })
            .expect(400)
    });
    test('tests POST request /user/register with existing email', async() => {
        agent2
            .post('/user/register')
            .send({
                username:'nonexistingUsername',
                email:'master@example.com',
                image:'testImage',
                description:'top',
                password:'bacon',
            })
            .expect(400)
    });
    test('tests POST request /user/login', async() => {
        agent1
            .post('/user/login')
            .send({input:'master',password:'bacon'})
            .expect(200,'set-cookie')
    });
    test('tests POST request /user/login with wrong credentials', async() => {
        agent1
            .post('/user/login')
            .send({input:'master',password:'bacon1'})
            .expect(400);
    });
    test('tests POST request /user/login with non existing user', async() => {
        agent1
            .post('/user/login')
            .send({input:'nonexisting',password:'bacon'})
            .expect(400);
    });
    test('tests GET request /user', async() => {
        agent1
            .get('/user')
            .expect(200);
    });
    test('tests GET request /user?id={userId}', async() => {
        agent1
            .get('/user')
            .query({id:agent1.jar.getCookie('id',null)})
            .expect(200);
    });
    test('tests GET request /user?id={userId} with non existing userId', async() => {
        const response = await request(app)
            .get('/user?id=642efd39fde490f2d4d3e84e')
            .expect(404);
    });
})


describe('Group API test', () => {
    test('tests POST request /group', async() => {
        agent1
            .post('/group')
            .send({
                name: 'testGroup',
                description: 'test Description',
                size: '4'
            })
            .expect(201);
    });
    test('tests POST request /group without logging in', async() => {
        const response = await request(app)
            .post('/group')
            .send({
                name: 'testGroup',
                description: 'test Description',
                size: '4'
            })
            .expect(401);
    });
    test('tests POST request /group with size bigger than 5', async() => {
        agent1
            .post('/group')
            .send({
                name: 'testGroup',
                description: 'test Description',
                size: '10'
            })
            .expect(400);
    });
    test('tests POST request /group with size smaller than 1', async() => {
        agent1
            .post('/group')
            .send({
                name: 'testGroup',
                description: 'test Description',
                size: '0'
            })
            .expect(400);
    });


    test('tests GET request /group', async() => {
        const response = await request(app)
            .get('/group')
            .expect(200)
    });

    test('tests GET request /group/:user without logging in', async() => {
        const response = await request(app)
            .get("/group/"+agent1.jar.getCookie('id',null))
            .expect(401);

    });
    test('tests GET request /group/:user with login', async() => {
        const id = agent1.jar.getCookie('id',null);
        agent1
            .get('/group/'+id)
            .expect(200)
    });
    test('tests GET request /group/:user with another user id', async() => {
        const id = agent2.jar.getCookie('id',null);
        agent1
            .get("/group/"+id)
            .expect(403)
    });
    test('tests GET request /group?code={groupCode}', async() => {
        agent1
            .get('/group')
            .query({code:'ABCDE'})
            .expect(200);
    });
    test('tests GET request /group?code={groupCode} with non existing groupcode', async() => {
        agent1
            .get('/group')
            .query({code:'NONEX'})
            .expect(404);
    });


    test('tests PUT request /group', async() => {
        agent1
            .put('/group')
            .send({
                id: '63b043e9d27dd44db71c0dd5',
                description: 'Modified Test Description',
                size: '3'
            })
            .expect(200);
    });
    test('tests PUT request /group without logging in', async() => {
        const response = await request(app)
            .put('/group')
            .send({
                id: '63b043e9d27dd44db71c0dd5',
                description: 'Modified Test Description',
                size: '3'
            })
            .expect(401);
    });
    test('tests PUT request /group with another user group', async() => {
        agent1
            .put('/group')
            .send({
                id: '63b0450fd27dd44db71c0de2',
                description: 'Modified Test Description',
                size: '3'
            })
            .expect(403);
    });
    test('tests PUT request /group with non existing group', async() => {
        agent1
            .put('/group')
            .send({
                id: '63a9ae1e99a3c59627b77709',
                description: 'Modified Test Description',
                size: '4'
            })
            .expect(404);
    });
    test('tests PUT request /group with invalid size', async() => {
        agent1
            .put('/group')
            .send({
                id: '63b043e9d27dd44db71c0dd5',
                description: 'Modified Test Description',
                size: '15'
            })
            .expect(400);
    });


    test('tests DELETE request /group', async() => {
        agent1
            .delete('/group')
            .send({
                id: '63b06652b3e7d41db68aec64'
            })
            .expect(204);
    });
    test('tests DELETE request /group with another user group', async() => {
        agent1
            .delete('/group')
            .send({
                id: '63b0450fd27dd44db71c0de2'
            })
            .expect(403);
    });
    test('tests DELETE request /group with non existing group', async() => {
        agent1
            .delete('/group')
            .send({
                id: '63af68b9d696114343fd7bbb'
            })
            .expect(404);
    });


    test('tests PUT request /group/request', async() => {
        agent1
            .put('/group/request')
            .send({
                id: '63b0450fd27dd44db71c0de2',
                character:'63b043fed27dd44db71c0dd7'
            })
            .expect(201);
    });
    test('tests PUT request /group/request with request already in list', async() => {
        agent1
            .put('/group/request')
            .send({
                id: '63b0450fd27dd44db71c0de2',
                character:'63b043fed27dd44db71c0dd7'
            })
            .expect(400);
    });
    test('tests PUT request /group/request with a character not in user list', async() => {
        agent1
            .put('/group/request')
            .send({
                id: '63b0460fd27dd44db71c0ded',
                character:'63a9b17e278d907fb6827a72'
            })
            .expect(400);
    });
    test('tests PUT request /group/request with non existing group', async() => {
        agent1
            .put('/group/request')
            .send({
                id: '63b0460fd27dd44db71c0dee',
                character:'63b043fed27dd44db71c0dd7'
            })
            .expect(404);
    });
    test('tests PUT request /group/request with user being the master', async() => {
        agent1
            .put('/group/request')
            .send({
                id: '63b043e9d27dd44db71c0dd5',
                character:'63b043fed27dd44db71c0dd7'
            })
            .expect(400);
    });
    test('tests PUT request /group/request with group being full', async() => {
        agent1
            .put('/group/request')
            .send({
                id: '63b046b9d27dd44db71c0df8',
                character:'63b043fed27dd44db71c0dd7'
            })
            .expect(400);
    });


    test('tests PUT request /group/accept', async() => {
        agent1
            .put('/group/accept')
            .send({
                id: '63b043e9d27dd44db71c0dd5',
                user: agent2.jar.getCookie('id',null),
                request:'63b0651a64e66c9a5f774b7a',
                character:'63b0651064e66c9a5f774b5f'
            })
            .expect(200);
    });
    test('tests PUT request /group/accept without loggin in', async() => {
        const response = await request(app)
            .put('/group/accept')
            .send({
                id: '63b043e9d27dd44db71c0dd5',
                user: agent2.jar.getCookie('id',null),
                request:'63b0488ed27dd44db71c0e24',
                character:'63b04845d27dd44db71c0e17'
            })
            .expect(401);
    });
    test('tests PUT request /group/accept with another user group', async() => {
        agent1
            .put('/group/accept')
            .send({
                id: '63b0450fd27dd44db71c0de2'
            })
            .expect(403);
    });
    test('tests PUT request /group/decline', async() => {
        agent1
            .put('/group/decline')
            .send({
                id: '63b06594b3e7d41db68aeb09',
                request:'63b06727b3e7d41db68aecaf',
            })
            .expect(200);
    });
    test('tests PUT request /group/decline without loggin in', async() => {
        const response = await request(app)
            .put('/group/decline')
            .send({
                id: '63b043e9d27dd44db71c0dd5',
            })
            .expect(401);
    });
    test('tests PUT request /group/decline with another user group', async() => {
        agent1
            .put('/group/decline')
            .send({
                id: '63b0450fd27dd44db71c0de2',
            })
            .expect(403);
    });


    test('tests PUT request /group/remove', async() => {
        agent1
            .put('/group/decline')
            .send({
                playerid: '63b04daed27dd44db71c0e95',
                id:'63b043e9d27dd44db71c0dd5'
            })
            .expect(200);
    });
    test('tests PUT request /group/remove with player not in list', async() => {
        agent1
            .put('/group/decline')
            .send({
                id:'63b043e9d27dd44db71c0dd5',
                playerid: '63b0646264e66c9a5f774a62'
            })
            .expect(400);
    });
    test('tests PUT request /group/remove without logging in', async() => {
        const response = await request(app)
            .put('/group/decline')
            .send({
                playerid: '63b04daed27dd44db71c0e94',
                id:'63b043e9d27dd44db71c0dd5'
            })
            .expect(401);
    });
    test('tests PUT request /group/remove with user not being master', async() => {
        agent1
            .put('/group/decline')
            .send({
                id:'63b0450fd27dd44db71c0de2'
            })
            .expect(403);
    });


    test('tests GET request /group/chat', async() => {
        agent1
            .get('/group/chat/XGKCR')
            .expect(200);
    });
    test('tests GET request /group/chat without logging in', async() => {
        const response = await request(app)
            .get('/group/chat/XGKCR')
            .expect(401);
    });
    test('tests GET request /group/chat with user not being in group', async() => {
        agent1
            .get('/group/chat/BFQDM')
            .expect(403);
    });


    test('tests PUT request /group/chat', async() => {
        agent1
            .put('/group/chat')
            .send({
                id:'63b043e9d27dd44db71c0dd5',
                message:'test message'
            })
            .expect(201);
    });
    test('tests PUT request /group/chat without logging in', async() => {
        const response = await request(app)
            .put('/group/chat')
            .send({
                id:'63b043e9d27dd44db71c0dd5',
                message:'test message'
            })
            .expect(401);
    });
    test('tests PUT request /group/chat without user not being in group', async() => {
        agent1
            .put('/group/chat')
            .send({
                id:'63b0450fd27dd44db71c0de2',
                message:'test message'
            })
            .expect(403);
    });
    test('tests PUT request /group/chat/roll', async() => {
        agent1
            .put('/group/chat/roll?num=4&type=6')
            .send({
                id:'63b043e9d27dd44db71c0dd5',
            })
            .expect(201);
    });
    test('tests PUT request /group/chat/roll with invalid dice type', async() => {
        agent1
            .put('/group/chat/roll?num=4&type=5')
            .send({
                id:'63b043e9d27dd44db71c0dd5',
            })
            .expect(500);
    });
    test('tests PUT request /group/chat/roll with invalid dice number', async() => {
        agent1
            .put('/group/chat/roll?num=101&type=6')
            .send({
                id:'63b043e9d27dd44db71c0dd5',
            })
            .expect(500);
    });
});


describe('Character API test',() =>{
    test('tests POST request /character', async() => {
        agent1
            .post('/character')
            .send({
                name:'character',
                image:'image',
                class:'mage',
                stats:[{stat:'strength',value:10},{stat:'dexterity',value:12},{stat:'intelligence',value:13},{stat:'charisma',value:15}]
            })
            .expect(201)
    });
    test('tests POST request /character with invalid stats array', async() => {
        agent1
            .post('/character')
            .send({
                name:'character',
                image:'image',
                class:'mage',
                stats:[{stat:'strength',value:10},{stat:'dexterity',value:12},{stat:'intelligence',value:13},{stat:'charisma',value:15},{stat:'test',value:50}]
            })
            .expect(400)
    });
    test('tests POST request /character without logging in', async() => {
        const response = await request(app)
            .post('/character')
            .send({
                name:'character',
                image:'image',
                class:'mage',
                stats:[{stat:'strength',value:10},{stat:'dexterity',value:12},{stat:'intelligence',value:13},{stat:'charisma',value:15},{stat:'test',value:50}]
            })
            .expect(401)
    });
    test('tests GET request /character', async() => {
        agent1
            .get('/character')
            .expect(200)
    });
    test('tests GET request /character?id={characterId}', async() => {
        agent1
            .get('/character')
            .query({id:agent1.jar.getCookie('id',null)})
            .expect(200)
    });
    test('tests GET request /character?id={characterId} with invalid id', async() => {
        agent1
            .get('/character?id=63b054d7d27dd44db71c0ee0')
            .expect(404)
    });


    test('tests PUT request /character', async() => {
        agent1
            .put('/character')
            .send({
                name:'modifiedName',
                id:'63b06596b3e7d41db68aec3d'
            })
            .expect(200)
    });
    test('tests PUT request /character with another user character', async() => {
        agent1
            .put('/character')
            .send({
                name:'modifiedName',
                id:'63b04845d27dd44db71c0e17'
            })
            .expect(403)
    });
    test('tests PUT request /character without logging in', async() => {
        const response = await request(app)
            .put('/character')
            .send({
                name:'modifiedName',
                id:'63b04845d27dd44db71c0e17'
            })
            .expect(401)
    });


    test('tests DELETE request /character', async() => {
        agent1
            .delete('/character')
            .send({
                id:'63b06596b3e7d41db68aec3d'
            })
            .expect(204)
    });
    test('tests DELETE request /character with another user character', async() => {
        agent1
            .delete('/character')
            .send({
                id:'63b04845d27dd44db71c0e17'
            })
            .expect(403)
    });
    test('tests DELETE request /character without logging in', async() => {
        const response = await request(app)
            .delete('/character')
            .send({
                id:'63b04845d27dd44db71c0e17'
            })
            .expect(401)
    });
})
