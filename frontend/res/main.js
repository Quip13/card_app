var currentYear = (new Date()).getFullYear()
var initialPedigreeNode = {
    name: "J",
    sex: "",
    yob: currentYear,
    mother: "",
    father: "",
    nPartners: undefined,
    partners: [],
    nChildren: undefined,
    children: [],
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
            Object.entries(this.pedigreeNodes).forEach(([nodeID, nodeData]) => {
                if(parseInt(nodeData.nPartners) > 0){
                    Array(parseInt(nodeData.nPartners)).fill().forEach((_, partnerIndex) => {
                        if(!nodeData.partners[partnerIndex]){
                            nodeData.partners[partnerIndex] = ObjectID().str
                            this.$set(this.pedigreeNodes, nodeID, nodeData)
                            this.$set(this.pedigreeNodes, nodeData.partners[partnerIndex], JSON.parse(JSON.stringify(initialPedigreeNode)))
                        }
                    })
                    if(parseInt(nodeData.nPartners) < nodeData.partners.length) {
                        nodeData.partners.slice(parseInt(nodeData.nPartners)).forEach((partnerID) => {
                            this.$delete(this.pedigreeNodes, partnerID)
                        })
                        nodeData.partners = nodeData.partners.slice(0, parseInt(nodeData.nPartners))
                        this.$set(this.pedigreeNodes, nodeID, nodeData)
                    }
                }
                if(parseInt(nodeData.nChildren) > 0){
                    Array(parseInt(nodeData.nChildren)).fill().forEach((_, childIndex) => {
                        if(!nodeData.children[childIndex]){
                            nodeData.children[childIndex] = ObjectID().str
                            this.$set(this.pedigreeNodes, nodeID, nodeData)
                            this.$set(this.pedigreeNodes, nodeData.children[childIndex], JSON.parse(JSON.stringify(initialPedigreeNode)))
                        }
                    })
                    if(parseInt(nodeData.nChildren) < nodeData.children.length) {
                        nodeData.children.slice(parseInt(nodeData.nChildren)).forEach((childID) => {
                            this.$delete(this.pedigreeNodes, childID)
                        })
                        nodeData.children = nodeData.children.slice(0, parseInt(nodeData.nChildren))
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
                var children = partnerData.children.map((childID) => {
                    var childData = this.pedigreeNodes[childID]
                    console.log(childData)
                    return {
                        name: childData.name
                    }
                })
                probandNode.marriages.push({
                    spouse: {
                        name: partnerData.name,
                    },
                    children: children
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
