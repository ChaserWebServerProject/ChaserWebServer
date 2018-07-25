const async = require('async');

const JobType = require('../models/JobType');
const Job = require('../models/Job');
const JobExtend = require('../models/JobExtend');
const City = require('../models/City');
const User = require('../models/User');
const Company = require('../models/Company');
const Province = require('../models/Province');
const Notification = require('../models/Notification');

const getAllJobs = () => {
    return Job.find()
        .populate('jobExtend', 'position deadline salary graduation workType amount genderRequirement')
        .populate('jobType', 'orderId jobTypeName')
        .populate({
            path: 'city',
            select: 'orderId cityCode cityName',
            populate: {
                path: 'province',
                select: 'orderId provinceCode provinceName'
            }
        })
        .populate({
            path: 'user',
            populate: {
                path: 'company',
                select: 'orderId companyName'
            }
        });
};

const getJobById = (id) => {
    return Job.findById(id)
        .populate('jobExtend',
            `position deadline salary graduation 
        workType amount genderRequirement experience 
        description requirement benefit contact`)
        .populate('jobType', 'jobTypeName')
        .populate({
            path: 'city',
            select: 'cityCode cityName',
            populate: {
                path: 'province',
                select: 'provinceCode provinceName'
            }
        })
        .populate({
            path: 'user',
            populate: {
                path: 'company',
                select: 'orderId companyName'
            }
        });
};

const unJoinFromJob = (req)=>{
    return new Promise(async (resolve, reject) => {
        const id = req.params.id;
        const userId = req.body.userId;
        Job.findByIdAndUpdate(id, {
                $pull: {
                    joinedUsers: userId
                }
            })
            .then(() => {
                User.findByIdAndUpdate(userId, {
                        $pull: {
                            joinedJobs: id
                        }
                    })
                    .then(() => resolve(true))
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}

const joinToJob = (req) => {
    return new Promise(async (resolve, reject) => {
        const id = req.params.id;
        const userId = req.body.userId;
        Job.findByIdAndUpdate(id, {
                $push: {
                    joinedUsers: userId
                }
            })
            .then(() => {
                User.findByIdAndUpdate(userId, {
                        $push: {
                            joinedJobs: id
                        }
                    })
                    .then(() => resolve(true))
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}

const filterJoinedUsersByAmount = (req) => {
    return new Promise(async (resolve, reject) => {
        const id = req.params.id;
        const amount = req.params.amount;
        Job.findById(id)
            .populate('joinedUsers')
            .then((job) => {
                const joinedUsers = job.joinedUsers;
                const joinedAmount = joinedUsers.slice(0, amount);
                return resolve(joinedAmount)
            })
            .catch(err => reject(err));
    });
}

const createJob = (req) => {
    return new Promise(async (resolve, reject) => {
        const job = new Job(req.body.job);
        const jobExtend = new JobExtend(req.body.job_extend);
        const noti = new Notification();
        job.jobExtend = jobExtend._id;
        jobExtend.job = job._id;

        async.waterfall([
            (callback) => {
                job.save()
                    .then(() => callback(null))
                    .catch(err => reject(err));
            },
            (callback) => {
                jobExtend.save()
                    .then(() => callback(null))
                    .catch(async (err) => {
                        await Job.remove(job)
                            .catch(err => reject(err));
                        return reject(err);
                    });
            },
            (callback) => {
                User.findByIdAndUpdate(job.user, {
                        $push: {
                            createdJobs: job.id
                        }
                    })
                    .then(() => callback(null))
                    .catch(err => reject(err));
            },
            (callback) => {
                JobType.findByIdAndUpdate(job.jobType, {
                        $push: {
                            jobs: job.id
                        }
                    })
                    .then(() => callback(null))
                    .catch(err => reject(err));
            },
            (callback) => {
                City.findByIdAndUpdate(job.city, {
                        $push: {
                            jobs: job.id
                        }
                    })
                    .then(() => callback(null))
                    .catch(err => reject(err));
            },
            (callback) => {
                //add notification
                noti.save()
                    .then(() => callback(null))
                    .catch(err => reject(err));
            },
            (callback) => {
                User.find()
                    .then(users => callback(null, users))
                    .catch(err => reject(err));
            },
            (users, callback) => {
                getJobById(job._id)
                    .then(job => callback(null, users, job))
                    .catch(err => reject(err));
            },
            (users, job, callback) => {
                Notification.findByIdAndUpdate(noti._id, {
                        $push: {
                            'receivers': {
                                '$each': users
                            }
                        },
                        message: `Công ty ${job.user.company.companyName} đang tuyển dụng 
                        "${job.jobName.toLowerCase()}"`,
                        job: job
                    }).then(() => callback(null))
                    .catch(err => reject(err));
            },
        ], (err, result) => {
            if (err) return reject(err);
            resolve(true);
        });
    });
};

const updateJob = (req) => {
    return new Promise((resolve, reject) => {
        const id = req.params.id;
        const body = req.body;

        async.waterfall([
            (callback) => {
                //update job data
                Job.findByIdAndUpdate(id, body, {
                        runValidators: true
                    })
                    .then(async (job) => {
                        await JobExtend.findOneAndUpdate({
                                job: id
                            }, body, {
                                runValidators: true
                            })
                            .catch(err => reject(err));
                        return callback(null, job); //return old job data
                    })
                    .catch(err => reject(err));
            },
            (job, callback) => {
                // job is old data
                //delete old reference data
                JobType.findByIdAndUpdate(job.jobType, {
                        $pull: {
                            jobs: job.id
                        }
                    })
                    .then(() => callback(null, job))
                    .catch(err => reject(err));
            },
            (job, callback) => {
                //delete old reference data
                City.findByIdAndUpdate(job.city, {
                        $pull: {
                            jobs: job.id
                        }
                    })
                    .then(() => callback(null, job))
                    .catch(err => reject(err));
            },
            (job, callback) => {
                //update new references data
                JobType.findByIdAndUpdate(body.jobType, {
                        $push: {
                            jobs: job.id
                        }
                    })
                    .then(() => callback(null, job))
                    .catch(err => reject(err));
            },
            (job, callback) => {
                //update new references data                
                City.findByIdAndUpdate(body.city, {
                        $push: {
                            jobs: job.id
                        }
                    })
                    .then(() => callback(null))
                    .catch(err => reject(err));
            },
            (callback) => {
                getJobById(id)
                    .then(job => callback(null, job))
                    .catch(err => reject(err));
            }
        ], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const deleteJob = (req) => {
    return new Promise((resolve, reject) => {

        const id = req.params.id;

        async.waterfall([
            (callback) => {
                JobExtend.findOneAndRemove({
                        job: id
                    })
                    .then(() => callback(null))
                    .catch(err => reject(err));
            },
            (callback) => {
                Job.findByIdAndRemove(id)
                    .then(job => callback(null, job))
                    .catch(err => reject(err));
            },
            (job, callback) => {
                User.findByIdAndUpdate(job.user, {
                        $pull: {
                            createdJobs: job.id
                        }
                    })
                    .then(() => callback(null, job))
                    .catch(err => reject(err));
            },
            (job, callback) => {
                JobType.findByIdAndUpdate(job.jobType, {
                        $pull: {
                            jobs: job.id
                        }
                    })
                    .then(() => callback(null, job))
                    .catch(err => reject(err));
            },
            (job, callback) => {
                City.findByIdAndUpdate(job.city, {
                        $pull: {
                            jobs: job.id
                        }
                    })
                    .then(() => callback(null))
                    .catch(err => reject(err));
            },
        ], (err, result) => {
            if (err) return reject(err);
            else resolve(true);
        });
    });
};

const increase_views = (id) => {
    return new Promise((resolve, reject) => {
        Job.findById(id)
            .then(job => {
                job.views = job.views + 1;
                job.save()
                    .then(() => resolve(true))
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}

const markJob = (req) => {
    return new Promise((resolve, reject) => {
        const id = req.body.jobId,
            user = req.body.userId;
        Job.findByIdAndUpdate(id, {
                $push: {
                    markedUsers: user
                }
            })
            .then(() => {
                User.findByIdAndUpdate(user, {
                        $push: {
                            markedJobs: id
                        }
                    })
                    .then(() => resolve(true))
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}

const unMarkJob = (req) => {
    return new Promise((resolve, reject) => {
        const id = req.body.jobId,
            user = req.body.userId;
        Job.findByIdAndUpdate(id, {
                $pull: {
                    markedUsers: user
                }
            })
            .then(() => {
                User.findByIdAndUpdate(user, {
                        $pull: {
                            markedJobs: id
                        }
                    })
                    .then(() => resolve(true))
                    .catch(err => reject(err));
            })
            .catch(err => reject(err));
    });
}

const filterJobByProvinceOrderId = (jobs, provinceOrderId) => {
    let orderProvince;
    const result = jobs.filter((job) => {
        orderProvince = job.city.province.orderId;
        return orderProvince == provinceOrderId;
    });
    return result;
}

const filterJobByJobTypeOrderId = (jobs, jobTypeOrderId) => {
    let orderType;
    const result = jobs.filter((job) => {
        orderType = job.jobType.orderId;
        return orderType == jobTypeOrderId;
    });
    return result;
}

const filterJobByJobTypeAndProvinceOrderId = (jobs, jobTypeOrderId, provinceOrderId) => {
    let orderType, orderProvince;
    const result = jobs.filter((job) => {
        orderType = job.jobType.orderId;
        orderProvince = job.city.province.orderId;
        return orderType == jobTypeOrderId && orderProvince == provinceOrderId;
    });
    return result;
}

const filterJobBySearchContent = (jobs, name) => {
    let jobName;
    const result = jobs.filter((job) => {
        jobName = job.jobName.trim().toLowerCase();
        return jobName.includes(name.trim().toLowerCase());
    });
    return result;
}

module.exports = {
    getAllJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    filterJobByProvinceOrderId,
    filterJobByJobTypeOrderId,
    filterJobByJobTypeAndProvinceOrderId,
    filterJobBySearchContent,
    increase_views,
    markJob,
    unMarkJob,
    joinToJob,
    filterJoinedUsersByAmount,
    unJoinFromJob
};