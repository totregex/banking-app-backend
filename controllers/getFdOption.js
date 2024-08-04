module.exports = async (req,res) => {
    // console.log(req.body)
    const fdir = [
        [7, 45, 3, 3.5],
        [46, 179, 4.5, 5.0],
        [180, 210, 5.35, 5.75],
        [211, 365, 5.88, 6.25],
    ];
    const option = req.params.option;
    const age=req.user.age
    if (option < 0 || option >= fdir.length) {
        return res.status(400).send("Invalid option");
    }
    const interest= age<60? fdir[option][2]:fdir[option][3];
    res.send({
        age:age,
        interest:interest,
        minTime:fdir[option][0],
        maxTime:fdir[option][1]
    })
}