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
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
dotenv_1.default.config({ path: ".env.dev" });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.listen(PORT, (error) => {
    if (!error)
        console.log("Server is running, listening on port " + PORT);
    else
        console.log("Error occurred, server can't start", error);
});
const initApp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            throw new Error("DATABASE_URL is not defined");
        }
        yield mongoose_1.default.connect(dbUrl, {});
        const db = mongoose_1.default.connection;
        db.on("error", (error) => { throw new Error(error); });
        db.once("open", () => console.log("Connected to Database"));
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Error init application: ${error.message}`);
        }
        else {
            console.error("Error init application:", error);
        }
        throw error;
    }
});
initApp();
//# sourceMappingURL=app.js.map