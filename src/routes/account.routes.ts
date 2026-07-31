import { Router } from "express";
import { AccountController } from "../controllers/account.controller";

const router = Router();
const controller = new AccountController();

router.get("/", controller.getAccounts.bind(controller));

router.get("/:id", controller.getAccount.bind(controller));

router.post("/", controller.createAccount.bind(controller));

router.put("/:id", controller.updateAccount.bind(controller));

router.delete("/:id", controller.deleteAccount.bind(controller));

export default router;