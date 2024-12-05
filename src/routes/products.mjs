import { Router } from 'express';

const router = Router();

router.get('/api/products', (req, res) => {
    return res.status(200).send({ msg: "Products Decoy" });
})

export default router;