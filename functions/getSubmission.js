const getSubmission = async ({ strapi, event }) => {
  return strapi.documents("api::submission.submission").findOne({
      documentId: event.result.documentId,
      populate: "*"
    })
}

module.exports = {
  getSubmission
}
