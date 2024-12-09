const getGlobal = async (strapi, event) => {
  return strapi.service("api::global.global").findOne(
    event.result.id, {
      populate: ["*"],
    }
  )
}

module.exports = {
  getGlobal
}
