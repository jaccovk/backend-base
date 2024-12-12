const getGlobal = async ({ strapi, event }) => {
  return strapi.documents("api::global.global").findOne({
      documentId: event.result.documentId,
      populate: "*"
    })
}

module.exports = {
  getGlobal
}
