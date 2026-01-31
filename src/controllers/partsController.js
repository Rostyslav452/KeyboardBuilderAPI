const getAllParts = asyncHandler(async (req, res, next) => {
    
});

router.route("/").get(getAllParts).post(createPart);

router.route("/:id").get(getPartById).patch(updatePart).delete(deletePart);
