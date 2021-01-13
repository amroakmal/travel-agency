class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const execludedFields = ['sort', 'page', 'fields', 'limit'];
        let queryStrToObj = { ...this.queryString };
        execludedFields.forEach(el => delete queryStrToObj[el]);

        let queryStr = JSON.stringify(queryStrToObj);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, matched => `$${matched}`);
        this.query = this.query.find(JSON.parse(queryStr));
        
        return this;
    }

    sort() {
        if(this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        if(this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const toBeSkipped = (page - 1) * limit;

        this.query = this.query.skip(toBeSkipped).limit(limit);

        // if(this.queryString.page) {
        //     const totalNumberOfTours = await TourModel.countDocuments();
        //     if(toBeSkipped >= totalNumberOfTours) {
        //         throw new Error ('This page does not exist!');
        //     }
        // }

        return this;
    }
}

module.exports = APIFeatures;