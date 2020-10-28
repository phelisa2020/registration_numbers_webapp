
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


    it("should be able to add registration to the database", async function () {

        var regNo = registrations(pool);

        var number = 'CA 1234'

        await regNo.addRegNumber(number)


        assert.deepStrictEqual([{ reg_number: 'CA 1234' }], await regNo.getList());
    });

    it("should be able to add multiple registrations to the database", async function () {
        var regNo = registrations(pool);

        const number2 = 'CJ 123456';
        const number3 = "CY 2345";
        const number4 = "CA 876-568";

        await regNo.addRegNumber(number2)
        await regNo.addRegNumber(number3)
        await regNo.addRegNumber(number4)
        const allReg = await regNo.getList()

        assert.deepStrictEqual([{ reg_number: "CJ 123456" }], [{ reg_number: 'CJ 123456' }], [{ reg_number: 'CY 2345' }], [{ reg_number: 'CA 876-568' }], allReg);
    });

    it("should be able to filter for Cape Town ", async function () {
        var regNo = registrations(pool);

        await regNo.addRegNumber("CJ 12345")
        await regNo.addRegNumber("CA 12345")

        assert.deepStrictEqual([{ reg_number: "CA 1234" }], [{ reg_number: "CA 1234" }], [{ reg_number: "CA 12345" }], await regNo.regFilter('1'));
    });

    it("should be able to filter for Paarl ", async function () {
        var regNo = registrations(pool);

        await regNo.addRegNumber("CJ 12345")
        await regNo.addRegNumber("CA 12345")

        assert.deepStrictEqual([{ reg_number: "CJ 123456" }], [{ reg_number: "CJ 123456" }], [{ reg_number: "CJ 12345" }], await regNo.regFilter('2'));
    });

    it("should be able to filter for Bellville ", async function () {
        var regNo = registrations(pool);

        await regNo.addRegNumber("CJ 12345")
        await regNo.addRegNumber("CY 12345")

        assert.deepStrictEqual([{ reg_number: "CY 2345" }], [{ reg_number: "CY 2345" }], [{ reg_number: "CY 12345" }], await regNo.regFilter('3'));
    });


    it("should return all the reg numbers", async function () {
        var regNo = registrations(pool);
        const number = "CA 1234";
        const number2 = "CJ 12345";
        const number3 = "CY 123456";

        await regNo.addRegNumber(number)
        await regNo.addRegNumber(number2)
        await regNo.addRegNumber(number3)


        assert.deepStrictEqual([{ reg_number: "CJ 12345" }], [{ reg_number: "CJ 12345" }], [{ reg_number: "CY 123456" }], await regNo.getList());
    });

})