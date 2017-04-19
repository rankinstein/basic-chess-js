const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('api healthcheck');
});

router.post('/', (req, res) => {
  console.log(req.body);
  res.send({success: true, move: 'move'});
})

module.exports = router;
