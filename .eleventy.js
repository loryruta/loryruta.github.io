
module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("src/assets");

    // Nunjucks helper returning the current year (used in templates)
    eleventyConfig.addNunjucksGlobal("now", function () {
        return new Date();
    });

    eleventyConfig.addNunjucksGlobal("getAge", function () {
        const today = new Date();
        const birthDate = new Date("2000-08-23");
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    });
};
