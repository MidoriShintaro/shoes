class Features {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  filterFields() {
    const queryObj = { ...this.queryStr };
    const excludeFields = ["page", "limit", "fields", "sort"];
    excludeFields.forEach((el) => delete queryObj[el]);

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gt|le|gte|lte)\b/g,
      (val) => `$${val}`
    );
    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }
  sort() {
    if (this.queryStr.sort) {
      const sort = this.queryStr.sort.split(",").join(" ");
      this.query = this.query.sort(sort);
    } else {
      this.query = this.query.sort("pice");
    }
    return this;
  }
  pagination() {
    let page = this.queryStr.page * 1 || 1;
    let limit = this.queryStr.limit * 1 || 9;
    let skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = Features;
