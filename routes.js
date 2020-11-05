module.exports = function CategoryRoutes(regNo) {

  function welcomeFlash(req, res) {
    req.flash('info', 'Welcome now');
    res.render('index')
  };

  function addedFlash(req, res) {
    req.flash('info', 'Flash Message Added');
    res.redirect('index')
  };

  async function listReg(req, res) {
    res.render('index', {

      registrations: await regNo.getList()

    })
  }
  async function filtering(req, res) {
    const town = req.query.town

    let errors = ""
    if (!town) {
      errors = 'Please select a town'
    }

    if (errors) {
      req.flash("error", errors),
        res.render("index")
    }

    else {
      res.render('index', {
        regNumber: await regNo.regFilter(town),

      });
    }
  }

  async function clear(req, res) {
    try {
      await regNo.reset();
    } catch (err) { }
    res.redirect('/');
  }

  async function addingPlate(req, res) {

    let regN = req.body.regNumbers;
    let plate = regN.toUpperCase()
    let errors = ""

    if (!plate) {

      errors = 'Please enter a registration number'
    }

    else if (!(/C[AYJ]\s\d{3,6}\D\d{3,9}|C[AYJ]\s\d{3,6}/gi.test(plate))) {
      errors = 'invalid registration number'
    }
    else {

      var error = await regNo.addRegNumber(regN);
    }
    if (errors) {
      req.flash("error", errors),
        res.render("index")
    }

    else {
      console.log(await regNo.getList())
      req.flash("error", error),
        res.render('index', {
          regNumber: await regNo.getList()


        });
    }
  }



  return {
    welcomeFlash,
    addedFlash,
    listReg,
    filtering,
    clear,
    addingPlate
  }
}