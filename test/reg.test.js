
let assert = require('assert')
let registrations = require('../registration')
const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/my_registration_test';
const pool = new Pool({
    connectionString
});

describe("The Registration function", function () {


    beforeEach(async function () {
        await pool.query(`delete from registrations`)

    });

   
    it("Should show be able to add 1 registrations in the database.", async function () {

        var regNo = registrations(pool);

        await regNo.addRegNumber('CJ 123-123')

        const list = await regNo.getList()

        assert.deepStrictEqual([{ reg_number: 'CJ 123-123' }], list);
    });

  
    it("Should be able to add 3 registrations in the database.", async function () {
        var regNo = registrations(pool);

        await regNo.addRegNumber("CA 123-123")
        await regNo.addRegNumber("CJ 123-124")
        await regNo.addRegNumber("CY 123-125")

        const list = await regNo.getList()

        assert.deepStrictEqual(list, [
            { reg_number: 'CA 123-123' },
            { reg_number: 'CJ 123-124' },
            { reg_number: 'CY 123-125' }
        ])
    });

    it("Should be able to add 2 registrations in the database without repeating the same reg number", async function () {
        var regNo = registrations(pool);

        await regNo.addRegNumber("CA 123-456")
        await regNo.addRegNumber("CJ 123-457")
        await regNo.addRegNumber("CJ 123-457")
        await regNo.addRegNumber("CJ 123-457")

        const list = await regNo.getList()

        assert.deepStrictEqual(list, [
            { reg_number: 'CA 123-456' },
            { reg_number: 'CJ 123-457' },
           
        ])
    });


  
   

})