/**
 * 定义 MainController
 **/
var MainController = nokit.define({

  /**
   * 初始化方法，每次请求都会先执行 init 方法
   **/
  init: function () {
    var self = this;
    self.ci = self.server.ci;
    //项目
    self.projects = self.ci.projects;
    self.projectName = self.context.params.project || Object.getOwnPropertyNames(self.projects)[0];
    self.project = self.ci.project(self.projectName);
    if (!self.project) {
      return self.context.notFound();
    }
    //job
    self.jobs = self.project.jobs;
    self.jobName = self.context.params.job || Object.getOwnPropertyNames(self.jobs)[0];
    self.job = self.project.job(self.jobName);
    if (!self.job) {
      return self.context.notFound();
    }
    //记录
    self.ci.store.find({
      projectName: self.projectName,
      name: self.jobName
    }).sort({
      sn: -1
    }).exec(function (err, records) {
      if (err) return self.context.error(err);
      self.records = records;
      self.sn = self.context.params.sn || (self.records[0] || {}).sn;
      self.ready();
    });
  },

  /**
   * 默认 action
   **/
  index: function () {
    var self = this;
    self.render("main", self);
  }

});

module.exports = MainController;