const Resource_z = require('../models/kanban');

const {
  validationResult
} = require('express-validator');

exports.getaddResource = (req, res, next) => {
  res.render('kanban/addkanban', {
    path: '/addResource',
    pageTitle: 'Add Task',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postaddResource = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('kanban/addkanban', {
      pageTitle: 'Add Task',
      path: '/addResource',
      editing: false,
      hasError: true,
      resource: {
        title: title,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  const resource = new Resource_z({
    title: title,
    description: description,
    userId: req.user
  });

  resource.save()
    .then(result => {
      console.log('Resource saved!');
      res.redirect('/admin/resources');
    }).catch(err => {
      console.log(err);
    })
}

exports.getResources = async(req, res, next) => {
  Resource_z.find({ status: { $ne: "approved"} }).populate('developerAssigned')
    .then(resources => {
      res.render('kanban/allkanban', {
        allResources: resources,
        pageTitle: 'All Tasks',
        path: '/',
      });
    })
    .catch(err => {
      console.log(err);
    });
};


exports.postDeleteResource = (req, res, next) => {
  const resourceID = req.body.kanbanId;
  Resource_z.deleteOne({
      _id: resourceID,
      userId: req.user._id
    })
    .then(() => {
      console.log('Resource Deleted!');
      res.redirect('/admin/resources');
    })
    .catch(err => console.log(err));
};


exports.getEditResource = (req, res, next) => {
  const editModez = req.query.edit;
  const resourceID = req.params.kanbanId;
  Resource_z.findById(resourceID)
    .then(resource => {
      if (!resource) {
        return res.redirect('/');
      }
      res.render('kanban/addkanban', {
        pageTitle: 'Edit Task',
        path: '/edit-resource',
        editing: editModez,
        resource: resource,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => console.log(err))
};


exports.postEditResource = (req, res, next) => {
  const resourceID = req.body.kanbanId;
  const updatedTitle = req.body.title;
  const updatedResource = req.body.description;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('kanban/addkanban', {
      pageTitle: 'Edit Task',
      path: 'EditResource',
      editing: true,
      hasError: true,
      resource: {
        title: updatedTitle,
        description: updatedResource,
        _id: resourceID
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  Resource_z.findById(resourceID)
    .then(resour => {
      if (resour.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      resour.title = updatedTitle;
      resour.description = updatedResource;
      return resour.save();
    })
    .then(results => {
      console.log('Resource Updated!');
      res.redirect('/');
    })
    .catch(err => console.log(err));
};

exports.getAdminResources = (req, res, next) => {
  Resource_z.find({
      userId: req.user._id,
      status: {$ne: "approved"}
    })
    .then(re => {
      res.render('kanban/adminkanban', {
        AllAdminResources: re,
        pageTitle: 'My Tasks',
        path: '/Admin-resource'
      });
    })
    .catch(err => console.log(err));
};

exports.approvedKanban = (req, res, next) => {
  const kanbanId = req.body.kanbanId;
  update_with = {
    kanban_approved_at: Date.now(),
    status: "approved"
  }

  Resource_z.findByIdAndUpdate(kanbanId, update_with, function (err, doc) {
    if (err) return res.send(500, {
      error: err
    });
    return res.redirect('/admin/resources');
  });
 
};

exports.getSearch = (req, res, next) => {
  const searchItem = req.query.search;
  Resource_z.find({
      title: new RegExp(searchItem, 'i')
    })
    .then(result => {
      res.render('kanban/allkanban', {
        allResources : result,
        pageTitle: 'All Tasks',
        path: '/'
      });
    })
    .catch(err => console.log(err));
};

exports.getAdminHistory = (req, res, next) => {
  Resource_z.find({
      userId: req.user._id,
      status: "approved"
    }).populate('developerAssigned')
    .then(re => {
      res.render('kanban/adminkanban', {
        AllAdminResources: re,
        pageTitle: 'History',
        path: '/Admin-history'
      });
    })
    .catch(err => console.log(err));
};