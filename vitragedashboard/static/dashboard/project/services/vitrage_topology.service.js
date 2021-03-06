(function() {
  'use strict';

  angular
    .module('horizon.dashboard.project.vitrage')
    .service('vitrageTopologySrv', VitrageTopologySrv);

  VitrageTopologySrv.$inject = ['$http', '$injector'];

  function VitrageTopologySrv($http, $injector) {
    var vitrageAPI;

    if ($injector.has('horizon.app.core.openstack-service-api.vitrage')) {
      vitrageAPI = $injector.get('horizon.app.core.openstack-service-api.vitrage');

    }
    function getTopology(graph_type) {

      if (vitrageAPI) {
        return vitrageAPI.getTopology(graph_type)
          .success(function(data) {
            return data;
          })
          .error(function(err) {
              console.error(err);
            }
          )
      }
    }

    function getAlarms(vitrage_id) {

      if (vitrageAPI) {
        return vitrageAPI.getAlarms(vitrage_id)
          .success(function(data) {
            return data;
          })
          .error(function(err) {
              console.error(err);
            }
          )
      }
    }


    function getRootCauseAnalysis(alarm_id) {
      if (vitrageAPI) {
        return vitrageAPI.getRca(alarm_id)
          .success(function(data) {
            return data;
          })
          .error(function(err) {
              console.error(err);
            }
          )
      }
    }

    return {
      getTopology: getTopology,
      getAlarms: getAlarms,
      getRootCauseAnalysis: getRootCauseAnalysis
    }
  }
})();
