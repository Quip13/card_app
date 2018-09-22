var currentYear = (new Date()).getFullYear()
var app = new Vue({
    el: '#app',
    data: function(){
        return {
            phase: 1,
            phaseValid: {},
            proband: {
                name: "J",
                sex: "Male",
                yob: "1995",
                nRepoductivePartners: 0,
                reproPartners: [],
            },
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
        proband: {
            handler: function(){
                alert("y")
                this.renderTree()
            },
            deep: true,
        },
    },
    methods: {
        renderTree: function() { 
            document.querySelector(this.treeOpts.target).innerHTML = ""
            dTree.init(this.generateTree(), this.treeOpts);
        },
        generateTree: function () {
            var probandNode = {
                name: this.proband.name,
                class: "node" + (["male", "female"].indexOf(this.proband.sex.toLowerCase()) != -1 ? (" " + this.proband.sex) : ""),
                extra: {
                    yob: this.proband.yob
                },
                marriages: []
            }
            if(this.proband.nRepoductivePartners > 0){
                console.log(this.proband)
                Array(parseInt(this.proband.nRepoductivePartners)).fill().forEach((_, partnerIndex) => {
                    if(!this.proband.reproPartners[partnerIndex]){
                        this.proband.reproPartners[partnerIndex] = {}
                    }
                })
            }
            var familyData = [probandNode]
            return familyData
        }
    }
})
/*proband.name = prompt("What is your name?")
proband.sex = prompt("What is your sex assigned at birth (male/female)?")
proband.sex = ["male", "female"].indexOf(proband.sex) != -1 ? proband.sex : "other"
proband.yob = prompt("What year were you born?")*/
