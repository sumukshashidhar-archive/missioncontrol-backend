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
      async function querier(studentID) {
        return new Promise(async (ress, rejj) => {
          await student.findOne({ emailID: studentID }, { student_name: 1 }, (errx, objx) => {
            if (errx) {
              console.error(errx)
              return false
            }
            else {
              ress(objx.student_name)
            }
          })
        })
      }
      assignment.find(
        { class_assigned: teacher_class, section: teacher_section, open: true },
        async (err, obj) => {
          if (err) {
            console.log(err);
            resolve(false);
          } else {
            for (let j = 0; j < obj.length; j++) {
              var newArr = [];
              for (let i = 0; i < obj[j]["submittedStudents"].length; i++) {
                var resp = await querier("sumuk@somethingelse.com")
                if (resp !== false) {
                  console.log("The response being pushed is:", resp)
                  newArr.push(resp)
                }
                else {
                  console.error(resp)
                }
              }
              obj[j]["submittedStudents"] = newArr;
            }
            console.log(obj)
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
        { student_name: 1, totalInteractionPoints: 1 },
        async (err, obj) => {
          if (err) {
            console.error(err);
            resolve(false);
          } else {
            console.log("Found Student: ", obj);
            if (
              (duration == 1 && obj["totalInteractionPoints"] >= 20) ||
              (duration == 2 && obj["totalInteractionPoints"] >= 50)
            ) {
              console.log("Found Student");
              // then check the assignments list to make sure that their name isn't already in there
              assignment.findById(
                { _id: assingment_id },
                async (err2, obj2) => {
                  if (err2) {
                    console.error(err);
                  } else {
                    console.log("Found Assignment");
                    console.log(obj2);
                    for (
                      let i = 0;
                      i < obj2["extensionPurchasedBy"].length;
                      i++
                    ) {
                      if (obj2["extensionPurchasedBy"][i] === student_id) {
                        console.log(obj2["extensionPurchasedBy"]);
                        console.log("Found the student in purchase list");
                        resolve(false);
                        return;
                      }
                    }
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
                          obj2["extensionPurchasedBy"].push(student_id);
                          obj2["newDueDate"].push(newDue);

                          // finally, assignment updating

                          assingment.updateOne(
                            { _id: assingment_id },
                            {
                              extensionPurchasedBy:
                                obj2["extensionPurchasedBy"],
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
              );
            } else {
              resolve(false);
            }
          }
        }
      );
    });
  },

  uploadCorrection: async (
    correctionLink,
    studentID,
    assignment_id,
    remarks
  ) => {
    return new Promise(async (resolve, reject) => {
      assingment.findById({ _id: assignment_id }, async (err, obj) => {
        if (err) {
          console.error(err);
          resolve(false);
          return;
        } else {
          try {
            for (let i = 0; i < obj["submittedStudents"].length; i++) {
              if (obj["submittedStudents"][i] === studentID) {
                // we found the student that we wish to upload the correction document to!
                obj["correctionLink"][i] = correctionLink;
                obj["remarks"][i] = remarks;
                assignment.updateOne(
                  { _id: assignment_id },
                  {
                    correctionLink: obj["correctionLink"],
                    remarks: obj["remarks"],
                  },
                  async (err2, obj2) => {
                    if (err2) {
                      console.error(err2);
                    } else {
                      console.log("Comes here");
                      resolve(true);
                      return;
                    }
                  }
                );
              }
            }
          } catch (error) {
            resolve(false);
            return;
          }
        }
      });
    });
  },

  uploadAssignemnt: async (assignmentLinker, studentID, assignment_id) => {
    return new Promise(async (resolve, reject) => {
      // for students to upload their assignments.
      // step 1: check if the assignment has already been uploaded
      assignment.findById(
        { _id: assignment_id, open: true },
        {
          submittedStudents: 1,
          submittedStudentsLink: 1,
          correctionLink: 1,
          remarks: 1,
        },
        async (err, obj) => {
          if (err) {
            console.error(err);
            resolve(false);
          } else {
            console.debug(obj);
            for (let i = 0; i < obj["submittedStudents"].length; i++) {
              if (obj["submittedStudents"][i] === studentID) {
                // means that the student has already submitted, and wants to resubmit. we'll allow it
                obj["submittedStudentsLink"][i] = {
                  link: assignmentLinker,
                  time: new Date().getTime(),
                };
                assignment.updateOne(
                  { _id: assignment_id },
                  { submittedStudentsLink: obj["submittedStudentsLink"] },
                  async (err2, obj2) => {
                    if (err2) {
                      console.error(err);
                    } else {
                      //successfully updated
                      resolve(true);
                      return;
                    }
                  }
                );
              }
            }
            // if it reaches here, it means that it ran through the entire thing, and did not find it
            obj["submittedStudents"].push(studentID);
            obj["submittedStudentsLink"].push({
              link: assignmentLinker,
              time: new Date().getTime(),
            });
            obj["correctionLink"].push(null);
            obj["remarks"].push(null);
            assignment.updateOne(
              { _id: assignment_id },
              {
                submittedStudentsLink: obj["submittedStudentsLink"],
                submittedStudents: obj["submittedStudents"],
                remarks: obj["remarks"],
                correctionLink: obj["correctionLink"],
              },
              async (err3, obj3) => {
                if (err3) {
                  console.error(err);
                } else {
                  //successfully updated
                  resolve(true);
                  return;
                }
              }
            );
          }
        }
      );
    });
  },
};
