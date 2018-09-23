var currentYear = (new Date()).getFullYear()
var initialPedigreeNode = {
    name: "J",
    sex: "",
    yob: currentYear,
    mother: "",
    father: "",
    nPartners: undefined,
    partners: []
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
                this.updatePedigree()
                this.renderTree()
            },
            deep: true,
        },
    },
    methods: {
        updatePedigree: function(){
            console.log(this.pedigreeNodes)
            Object.entries(this.pedigreeNodes).forEach(([nodeID, nodeData]) => {
                if(parseInt(nodeData.nPartners) > 0){
                    Array(parseInt(nodeData.nPartners)).fill().forEach((_, partnerIndex) => {
                        if(!nodeData.partners[partnerIndex]){
                            nodeData.partners[partnerIndex] = ObjectID().str
                            this.$set(this.pedigreeNodes, nodeID, nodeData)
                            console.log(initialPedigreeNode)
                            this.$set(this.pedigreeNodes, nodeData.partners[partnerIndex], JSON.parse(JSON.stringify(initialPedigreeNode)))
                        }
                    })
                    if(parseInt(nodeData.nPartners) < nodeData.partners.length) {
                        this.probandPartners.slice(parseInt(nodeData.nPartners)).forEach((partnerID) => {
                            this.$delete(this.pedigreeNodes, partnerID)
                        })
                        nodeData.partners = nodeData.partners.slice(0, parseInt(nodeData.nPartners))
                        this.$set(this.pedigreeNodes, nodeID, nodeData)
                    }
                }
            })
        },
        renderTree: function() { 
            document.querySelector(this.treeOpts.target).innerHTML = ""
            dTree.init(this.generateTree(), this.treeOpts);
        },
        generateTree: function () {
            var momNode = {

            }
            var probandNode = {
                name: this.pedigreeNodes[this.probandID].name,
                class: "node" + (["male", "female"].indexOf(this.pedigreeNodes[this.probandID].sex.toLowerCase()) != -1 ? (" " + this.pedigreeNodes[this.probandID].sex) : ""),
                extra: {
                    yob: this.pedigreeNodes[this.probandID].yob
                },
                marriages: []
            }
            this.pedigreeNodes[this.probandID].partners.forEach((partnerID) => {
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
        this.$set(this.pedigreeNodes, this.probandID, JSON.parse(JSON.stringify(initialPedigreeNode)))
    }
})
/*proband.name = prompt("What is your name?")
proband.sex = prompt("What is your sex assigned at birth (male/female)?")
proband.sex = ["male", "female"].indexOf(proband.sex) != -1 ? proband.sex : "other"
proband.yob = prompt("What year were you born?")*/
