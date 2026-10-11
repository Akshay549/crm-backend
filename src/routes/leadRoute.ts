import { Router } from "express";
import validate from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import { validateLeadId } from "../middleware/validateLeadId";
import {
    createLeadSchema,
    updateLeadSchema,
    updateStatusSchema,
    listLeadsQuerySchema,
} from "../validators/leadValidator";
import { createNoteSchema } from "../validators/noteValidator";
import {
    createLead,
    getLeads,
    getLeadById,
    updateLead,
    updateLeadStatus,
    deleteLead,
} from "../controllers/leadController";
import { getNotes, addNote } from "../controllers/noteController";

const router = Router();

// Every lead route needs a logged-in user
router.use(requireAuth);

// Checks the :id format on every route that has it
router.param("id", validateLeadId);

router.get("/", validate(listLeadsQuerySchema, "query"), getLeads);
router.post("/", validate(createLeadSchema), createLead);

router.get("/:id", getLeadById);
router.patch("/:id", validate(updateLeadSchema), updateLead);
router.patch("/:id/status", validate(updateStatusSchema), updateLeadStatus);
router.delete("/:id", deleteLead);

router.get("/:id/notes", getNotes);
router.post("/:id/notes", validate(createNoteSchema), addNote);

export default router;
