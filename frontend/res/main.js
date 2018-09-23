var currentYear = (new Date()).getFullYear()
var initialPedigreeNode = {
    name: "",
    sex: "",
    yob: currentYear,
    mother: "",
    father: ""
}
var app = new Vue({
    el: '#app',
    data: function(){
        return {
            phase: 1,
            phaseValid: {},
            probandID: ObjectID().str,
            nProbandParnters: 0,
            probandPartners: [],
            pedigreeNodes: {},
            treeOpts: {
                target: "#treeMap",
                callbacks: {
                    textRenderer: function (name, extra, textClass) {
                        if (extra && extra.yob) {
                            var yob = parseInt(extra.yob)
                            if (!isNaN(yob)) {
                                name = name + "<br><sub>(Age " + (currentYear - yob) + ")</sub>";
                            }
                        }
                        return "<p align='center' class='" + textClass + "'>" + name + "</p>";
                    }
                }
            }
        }
    },
    watch: {
        pedigreeNodes: {
            handler: function(){
                this.renderTree()
            },
            deep: true,
        },
        nProbandParnters: function() {
            if(this.nProbandParnters > 0){
                Array(parseInt(this.nProbandParnters)).fill().forEach((_, partnerIndex) => {
                    if(!this.probandPartners[partnerIndex]){
                        this.probandPartners[partnerIndex] = ObjectID().str
                        this.$set(this.pedigreeNodes, this.probandPartners[partnerIndex], Object.assign({}, initialPedigreeNode))
                    }
                })
                if(parseInt(this.nProbandParnters) < this.probandPartners.length) {
                    this.probandPartners.slice(parseInt(this.nProbandParnters)).forEach((partnerID) => {
                        this.$delete(this.pedigreeNodes, partnerID)
                    })
                    this.probandPartners = this.probandPartners.slice(0, parseInt(this.nProbandParnters))
                }
                console.log(this.probandPartners)
                console.log(this.pedigreeNodes)
            }
        }
    },
    methods: {
        renderTree: function() { 
            document.querySelector(this.treeOpts.target).innerHTML = ""
            dTree.init(this.generateTree(), this.treeOpts);
        },
        generateTree: function () {
            var probandNode = {
                name: this.pedigreeNodes[this.probandID].name,
                class: "node" + (["male", "female"].indexOf(this.pedigreeNodes[this.probandID].sex.toLowerCase()) != -1 ? (" " + this.pedigreeNodes[this.probandID].sex) : ""),
                extra: {
                    yob: this.pedigreeNodes[this.probandID].yob
                },
                marriages: []
            }
            this.probandPartners.forEach((partnerID) => {
                partnerData = this.pedigreeNodes[partnerID]
                probandNode.marriages.push({
                    spouse: {
                        name: partnerData.name,
                    }
                })
            })
            var familyData = [probandNode]
            return familyData
        }
    },
    mounted: function(){
        this.$set(this.pedigreeNodes, this.probandID, Object.assign({}, initialPedigreeNode))
    }
})
/*proband.name = prompt("What is your name?")
proband.sex = prompt("What is your sex assigned at birth (male/female)?")
proband.sex = ["male", "female"].indexOf(proband.sex) != -1 ? proband.sex : "other"
proband.yob = prompt("What year were you born?")*/
