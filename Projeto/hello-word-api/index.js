"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = __importDefault(require("pg"));
const body_parser_1 = __importDefault(require("body-parser"));
const md5_1 = __importDefault(require("md5"));
const lodash_1 = require("lodash");
const app = (0, express_1.default)();
const port = 3000;
app.use(body_parser_1.default.json());
app.use(express_1.default.static('public'));
const dbConnectionFields = {
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'postgres'
};
const client = new pg_1.default.Client(dbConnectionFields);
const pool = new pg_1.default.Pool(dbConnectionFields);
client.connect()
    .then(() => {
    console.log('Connected to the database');
})
    .catch((err) => {
    console.error('Failed to connect to the database', err);
});
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
app.get('/api/hello_world', (req, res) => {
    res.status(200).send("Adeus");
});
// Route handler for GET /api/sign_up
app.get('/api/sign_up', (req, res) => {
    res.sendFile(__dirname + "/sign_up.html");
});
// POST endpoint for /api/sign_up
app.post('/api/sign_up', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, confirmPassword } = req.body;
        // Input validation
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }
        // Sanitization
        const sanitizedFields = {
            name: (0, lodash_1.escape)(name),
            email: (0, lodash_1.escape)(email),
            password: (0, lodash_1.escape)(password),
        };
        // Hash password using MD5
        const hashedPassword = (0, md5_1.default)(sanitizedFields.password);
        // Insert new user into the database
        yield pool.query('INSERT INTO users (name, email, password_md5) VALUES ($1, $2, $3)', [sanitizedFields.name, sanitizedFields.email, hashedPassword]);
        return res.status(201).json({ message: 'User created successfully' });
    }
    catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'An unexpected error occurred' });
    }
}));
