module.exports = function regFactory(pool) {

    async function addRegNumber(plate) {
       
        if (!plate == "") {
            plate = plate.toUpperCase();

            const regPlate = plate.substring(0, 2).trim();
            const townsId = await pool.query(`select id from towns where starts_with=$1`, [regPlate]);
            const id = townsId.rows[0].id;

            let regExist;
            if (id > 0) {
                regExist = await pool.query(`select * from registrations where reg_number = $1`, [plate])
            }
            
            if (regExist.rowCount < 1) {
                await pool.query(`insert into registrations (reg_number, town_id) values ($1, $2)`, [plate,id])  
                                
               
            }
        }
    }
  
    
    async function getList () {
        let list = await pool.query('select reg_number from registrations');
        return list.rows;
    }
    async function regFilter (town) {
        if (town === 'all' || town === '') {
            let list = await pool.query('select reg_number from registrations');
            return list.rows;
        } else {
            const lists = await pool.query(`select * from registrations where town_id = $1;`, [town]);
            return lists.rows;
        }
    }
  
    async function reset() {
        var resetUp = await pool.query("delete from registrations")
    }
   

    return {
        addRegNumber,
        getList,
        regFilter,
        reset

    }
}