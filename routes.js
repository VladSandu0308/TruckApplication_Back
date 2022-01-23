const router = require('express').Router();
const {body} = require('express-validator');
const {register} = require('./controllers/registerController');
const {login} = require('./controllers/loginController');
const {transporterOffer} = require('./controllers/transporterOfferController');
const {clientRequest} = require('./controllers/clientRequestController');
const {generateContract} = require('./controllers/generateContractController');
const {getTransporters} = require('./controllers/getTransportersController');
const {getClients} = require('./controllers/getClientsController');
const { getUsers } = require('./controllers/getUsers');
const { updateUserRole } = require('./controllers/updateUserRole');
const { getContracts } = require('./controllers/getContracts');
const { updateContract } = require('./controllers/updateContract');

router.post('/register', [
    body('name',"Insert your real name which must be of minimum 3 characters length")
    .notEmpty()
    .escape()
    .trim()
    .isLength({ min: 3 }),
    body('email',"Invalid email address xD")
    .notEmpty()
    .escape()
    .trim().isEmail(),
    body('password',"The Password must be of minimum 4 characters length").notEmpty().trim().isLength({ min: 4 }),
    body('role', "Role must be Transporter, Client or Admin").notEmpty(),
    body('phone', 'Inalid phone').notEmpty()
], register);


router.post('/login',[
    body('email',"Invalid email address")
    .notEmpty()
    .escape()
    .trim().isEmail(),
    body('password',"The Password must be of minimum 4 characters length").notEmpty().trim().isLength({ min: 4 }),
],login);

router.post('/transporterOffer',[
  body('dep_date',"Invalid date").notEmpty(),
  body('dep_place',"Invalid place").notEmpty(),
  body('arival_date',"Invalid date").notEmpty(),
  body('arival_place',"Invalid place").notEmpty(),
  body('truck_type',"Invalid type").notEmpty(),
  body('volume',"Invalid size").notEmpty(),
  body('weight',"Invalid size").notEmpty(),
  body('length',"Invalid size").notEmpty(),
  body('width',"Invalid size").notEmpty(),
  body('height',"Invalid size").notEmpty(),
  body('empty_price',"Invalid price").notEmpty(),
  body('full_price',"Invalid price").notEmpty(),
  body('user',"Invalid user_id").notEmpty(),
  body('obs', 'Invalid')
], transporterOffer);

router.post('/clientRequest',[
  body('dep_date',"Invalid date").notEmpty(),
  body('dep_max_date',"Invalid date").notEmpty(),
  body('dep_place',"Invalid place").notEmpty(),
  body('arival_date',"Invalid date").notEmpty(),
  body('arival_max_date',"Invalid date").notEmpty(),
  body('arival_place',"Invalid place").notEmpty(),
  body('product_type',"Invalid type").notEmpty(),
  body('product_weight',"Invalid size").notEmpty(),
  body('product_volume',"Invalid size").notEmpty(),
  body('budget', 'Invalid budget').notEmpty(),
  body('user',"Invalid user_id").notEmpty(),
  body('obs', 'Invalid')
], clientRequest);

router.post('/contract', [
  body('trans',"Invalid truck_id").notEmpty(),
  body('client',"Invalid client_id").notEmpty(),
  body('dep_place',"Invalid place").notEmpty(),
  body('arival_place',"Invalid place").notEmpty(),
  body('price',"Invalid price").notEmpty(),
  body('pay_deadline', "Missing pay deadline")
], generateContract);

router.post('/updateUserRole', [
  body('name',"Insert your real name which must be of minimum 3 characters length").notEmpty(),
  body('role', "Role must be Transporter, Client or Admin").notEmpty(),
], updateUserRole);

router.post('/finishContract', [
  body('id', "Insert contract id").notEmpty()
], updateContract);

router.get('/getTransporters', getTransporters);
router.get('/getClients', getClients);
router.get('/getUsers', getUsers);
router.get('/getContracts', getContracts);

module.exports = router;