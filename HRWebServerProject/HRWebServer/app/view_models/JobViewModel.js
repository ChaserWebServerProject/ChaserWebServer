
const getUpdateJobViewModel = (job_jobExtend) => {
    const job = job_jobExtend.job;
    const jobExtend = job_jobExtend.job_extend;
    return {
        jobName: job.jobName,
        company: job.company,
        jobType: job.jobType,
        city: job.city,
        position: jobExtend.position,
        deadline: jobExtend.deadline,
        salary: jobExtend.salary,
        graduation: jobExtend.graduation,
        workType: jobExtend.workType,
        amount: jobExtend.amount,
        genderRequirement: jobExtend.genderRequirement
    };
}

module.exports = { getUpdateJobViewModel };
