define([
    'local_customgrader/vendor-vuex',
    'local_customgrader/grader-enums',
    'local_customgrader/grader-store'
], function (Vuex, g_enums, g_store) {
    var template = `
            <div>
                <table v-if="students.length > 0" id="user-grades" class="gradereport-grader-table table table-striped">
                    <tbody>
                        <!-- COURSE_TR -->
                        <tr class="GridViewScrollHeader" >
                            <th v-bind:colspan="additionalColumnsAtFirstLength"></th>
                            <th v-bind:colspan="gradeHeaderColspan">
                                <span class="gradeitemheader">        
                                    {{course.fullname}}       
                                </span>
                            </th>
                        </tr>
                        <!-- END OF COURSE_TR -->
                        <!-- CATEGORIES_TRS-->
                        <tr  v-for="categoryLevel in categoryLevels" >
                            <th v-bind:colspan="additionalColumnsAtFirstLength"></th>
                            <template v-for="(element, index) in categoryLevel">
                                <th v-if="element.type==='fillerfirst'" colspan="1"></th>
                                <ThCategory v-if="element.type === 'category' " v-bind:colspan="element.colspan" v-bind:element="element">
                                   
                                </ThCategory>
                                <td v-if="element.type === 'filler' || element.type === 'fillerlast'" v-bind:colspan="element.colspan"></td>

                            </template>
                            <th v-bind:colspan="additionalColumnsAtEndLength"></th>


                        </tr>
                        <!-- END OF CATEGORIES_TRS-->
                        <TrItems>  </TrItems>
                        <TrGrades v-for="(student, index) in students" v-bind:studentId="student.id" v-bind:studentIndex="index" :key="student.id"></TrGrades>
                    </tbody>
                </table>
                <div v-else>
                    Cargando información...
                </div>
                <div id="modals">
                    <ModalEditCategory></ModalEditCategory>
                    <ModalAddElement></ModalAddElement>
                </div>
                <v-dialog/>
            </div>
    `;
    var name = 'Main';
    var component  = {
        template: template,
        computed: {
            ...Vuex.mapState([
                'course',
                'categories',
                'additionalColumnsAtFirst',
                'additionalColumnsAtEnd'
            ]),
            ...Vuex.mapGetters([
                'categoryDepth',
                'itemsCount',
                'getCategoriesByDepth',
                'categoryLevels',
                'itemLevel',
                'courseLevel'
            ]),
            additionalColumnsAtFirstLength: function () {
                return this.additionalColumnsAtFirst.length;
            },
            additionalColumnsAtEndLength: function () {
                return this.additionalColumnsAtEnd.length;
            },
            students: function() {
                return this.$store.getters.studentSetSorted(g_enums.sortStudentMethods.NAME);
            },
            gradeHeaderColspan: function () {
                return Number(this.courseLevel.colspan) + this.additionalColumnsAtFirstLength + this.additionalColumnsAtEndLength;
            }

        },
        mounted: function () {
            this.$store.dispatch(g_store.actions.FETCH_STATE);
        }
    };
   return {
      component: component,
      name: name
   }
});