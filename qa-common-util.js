// Use module.exports to export the functions that should be
// available to use from this package.
// module.exports = { <your_function> }

// Once exported, use this statement in your scripts to use the package.
// const myPackage = pm.require('@bmcd-integration/<package_name>')


/**
 * Collects all tests
 */
const test = {
    /**
     * Collects all Success-related tests
     */
    success: {
        /**
         * Test for a 200 response code
         */
        test200() {
            pm.test(`When making the request, then the response is a 200 code`, function () {
                pm.expect(pm.response.code).to.equal(200);
            });
        },

        /**
         * Test for a Response Time Ceiling of 5000ms unless specified otherwise
         * @param {number} time Response Time Ceiling in Milliseconds
         */
        testResponseTime(time = 5000) {
            pm.test(`When making the request, then the response took less than ${time}ms`, function () {
                pm.expect(pm.response.responseTime).to.be.below(time);
            });
        },

        /**
         * Test confirming the properties in the first response
         * @param {string[]} listOfProps List of Properties Names
         */
        testAllProperties(listOfProps) {
            pm.test(`When making the request, then the response properties are as expected`, function () {
                const response = pm.response.json()[0];

                listOfProps.forEach(property => {
                    pm.expect(response).to.have.property(property);
                });
            });
        },

        /**
         * Test non-empty property. Iterates through the response nodes and verifies each result has the property
         * @param {string} propertyName Key string for a string or number property
         */
        testForNonEmptyProperty(propertyName) {
            const response = pm.response.json();

            pm.test(`When making the request, then ${propertyName} is non-empty in the ${Object.keys(response).length} response object(s)`, function () {
                response.forEach(node => {
                    pm.expect(String(node[propertyName])).to.not.be.empty;
                });
            });
        },

        /**
         * Test for optional properties if the property is in the request query parameters.
         * @param {string[]} listOfOptionalProps List of Optional string or number properties
         */
        testOptionalPropertiesExists(listOfOptionalProps) {
            listOfOptionalProps.forEach(optProp => {
                if (pm.request.url.getQueryString().includes(optProp)) {
                    test.success.testForNonEmptyProperty(optProp);
                }
            })
        },
    },

    failure: {
        //TODO
    },

    unavailable: {
        //TODO
    },
};

/**
 * Collects Gating Logic methods
 */
const gate = {
    /**
     * Collects Gating Logic that checks for a specific condition
     */
    byIf: {
        /**
         * Gates an action with a query parameter check. Will not execute if the query parameter isn't found.
         * @param {string} queryParam Parameter Name
         * @param {() => void} action Executable lambda given the query parameter exists
         */
        paramExists(queryParam, action) {
            if (pm.request.url.query.has(queryParam)) {
                action()
            }
        },
    },
}

/**
 * Collects utility methods for testing
 */
const util = {
    /**
     * ForEach wrapper for accessing the nodes within a response json, executing a lambda that accepts the node object as input.
     * @param {(json) => void} action Anonymouse lambda that acts on instances of nodes from a response
     */
    iterateOnResponseNodes(action) {
        pm.response.json().forEach(node => {
            action(node)
        })
    },

    /**
     * Comparison for date1 to be before/below date2
     * @param {string} dateKey1 Date value 1
     * @param {string} dateKey2 Date value 2
     */
    dateIsAfter(dateKey1, dateKey2) {
        const date1 = new Date(dateKey1);
        const date2 = new Date(dateKey2);

        pm.expect(date1).to.be.below(date2);
    },
}


module.exports = {
    test,
    gate,
    util,
}