const assingment = require("./../models/assingment");
const assignment = require("./../models/assingment");
const student = require("./../models/student");
module.exports = {
  makeAssignment: async (
    class_assigned,
    section,
    teacher_assigned,
    teacher_name,
    dueDate,
    assignmentName,
    assignmentLink
  ) => {
    return new Promise(async (resolve, reject) => {
      const newAssignment = new assignment({
        class_assigned: class_assigned,
        section: section,
        teacher_assigned_by: teacher_assigned,
        teacher_name: teacher_name,
        dueDate: dueDate,
        assignmentName: assignmentName,
        assignmentLink: assignmentLink,
      });
      newAssignment.save((err, obj) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  },

  getAssignments: async (student_class, student_section) => {
    return new Promise(async (resolve, reject) => {
      assignment.find(
        { class_assigned: student_class, section: student_section, open: true },
        { _id: 1, assignmentName: 1, assignmentLink: 1, dueDate: 1 },
        async (err, obj) => {
          if (err) {
            console.log(err);
            resolve(false);
          } else {
            resolve(obj);
          }
        }
      );
    });
  },

  getAssignmentsTeacher: async (teacher_class, teacher_section) => {
    return new Promise(async (resolve, reject) => {
      assignment.find(
        { class_assigned: teacher_class, section: teacher_section, open: true },
        async (err, obj) => {
          if (err) {
            console.log(err);
            resolve(false);
          } else {
            resolve(obj);
          }
        }
      );
    });
  },

  requestExtension: async (student_id, assingment_id, duration) => {
    return new Promise(async (resolve, reject) => {
      // first check if they have the balance to do so
      student.findOne(
        { emailID: student_id },
        { totalInteractionPoints: 1 },
        async (err, obj) => {
          if (err) {
            console.error(err);
            resolve(false);
          } else {
            if (
              (duration == 1 && obj["totalInteractionPoints"] >= 20) ||
              (duration == 2 && obj["totalInteractionPoints"] >= 50)
            ) {
              // then check the assignments list to make sure that their name isn't already in there
              assignment.findById({ id: assingment_id }, async (err2, obj2) => {
                if (err2) {
                  console.error(err);
                } else {
                  for (
                    let i = 0;
                    i < obj2["extensionPurchasedBy"].length;
                    i++
                  ) {
                    if (obj2["extensionPurchasedBy"] == student_id) {
                      resolve(false);
                    } else {
                      // if it has reached this stage, it means that the student has the appropriate points,
                      // and also has not purchased the extension. so, now, let us first deduct from the student
                      var interactpoints = obj["totalInteractionPoints"];
                      var newDue = obj2["dueDate"];
                      if (duration == 1) {
                        interactpoints = interactpoints - 20;
                        newDue = newDue + 24 * 3600;
                      } else if (duration == 2) {
                        interactpoints = interactpoints - 50;
                        newDue = newDue + 2 * 24 * 3600;
                      } else {
                        resolve(false);
                      }
                      student.updateOne(
                        { emailID: student_id },
                        { totalInteractionPoints: interactpoints },
                        async (err3, obj3) => {
                          if (err3) {
                            resolve(false);
                          } else {
                            // now we add the name of the student to the lists as well, along with IDs
                            obj2["extensionPurchasedBy"].append(student_id);
                            obj2["extensionPurchasedByNames"].append(
                              obj3["student_name"]
                            );
                            obj2["newDueDate"].append(newDue);

                            // finally, assignment updating

                            assingment.updateOne(
                              { _id: assingment_id },
                              {
                                extensionPurchasedBy:
                                  obj2["extensionPurchasedBy"],
                                extensionPurchasedByNames:
                                  obj2["extensionPurchasedByNames"],
                                newDueDate: newDue,
                              },
                              async (err4, obj4) => {
                                if (err4) {
                                  resolve(false);
                                } else {
                                  resolve(true);
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                }
              });
            } else {
              resolve(false);
            }
          }
        }
      );
    });
  },
};
